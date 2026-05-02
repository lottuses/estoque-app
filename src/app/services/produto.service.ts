import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    collectionData,
    doc,
    updateDoc,
    deleteDoc,
    runTransaction
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
    providedIn: 'root'
})
export class ProdutoService {

    private colecao = collection(this.firestore, 'produtos');

    constructor(private firestore: Firestore) { }

    listar(): Observable<Produto[]> {
        return collectionData(this.colecao, { idField: 'id' }) as Observable<Produto[]>;
    }

    adicionar(produto: Produto) {
        const novoProduto = {
            ...produto,
            quantidade: produto.quantidade ?? 0,
            criadoEm: new Date(),
            atualizadoEm: new Date()
        };

        return addDoc(this.colecao, novoProduto);
    }

    atualizar(id: string, produto: Produto) {
        const docRef = doc(this.firestore, `produtos/${id}`);

        return updateDoc(docRef, {
            ...produto,
            atualizadoEm: new Date()
        });
    }

    deletar(id: string) {
        const docRef = doc(this.firestore, `produtos/${id}`);
        return deleteDoc(docRef);
    }

    // 🔥 FUNÇÃO BASE (privada)
    private async atualizarEstoque(id: string, delta: number) {
        const docRef = doc(this.firestore, `produtos/${id}`);

        return runTransaction(this.firestore, async (transaction) => {
            const snap = await transaction.get(docRef);

            if (!snap.exists()) {
                throw new Error('Produto não encontrado');
            }

            const data = snap.data() as Produto;

            const atual = data.quantidade ?? 0;
            const novo = atual + delta;

            if (novo < 0) {
                throw new Error(`Estoque insuficiente para ${data.nome}`);
            }

            transaction.update(docRef, {
                quantidade: novo,
                atualizadoEm: new Date()
            });
        });
    }

    // ✅ ENTRADA DE ESTOQUE
    adicionarEstoque(id: string, quantidade: number) {
        if (quantidade <= 0) return;
        return this.atualizarEstoque(id, quantidade);
    }

    // 🔥 SAÍDA DE ESTOQUE (VENDA)
    baixarEstoque(id: string, quantidade: number) {
        if (quantidade <= 0) return;
        return this.atualizarEstoque(id, -quantidade);
    }
}
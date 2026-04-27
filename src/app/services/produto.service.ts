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
            quantidade: produto.quantidade ?? 0, // 🔥 garante valor inicial
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

    // 🚀 NOVA FUNÇÃO — atualização segura de estoque
    atualizarEstoque(id: string, quantidadeDelta: number) {
        const docRef = doc(this.firestore, `produtos/${id}`);

        return runTransaction(this.firestore, async (transaction) => {
            const docSnap = await transaction.get(docRef);

            if (!docSnap.exists()) {
                throw new Error('Produto não encontrado');
            }

            const data = docSnap.data() as Produto;

            const quantidadeAtual = data.quantidade ?? 0;
            const novaQuantidade = quantidadeAtual + quantidadeDelta;

            // 🔥 REGRA DE NEGÓCIO
            if (novaQuantidade < 0) {
                throw new Error('Estoque não pode ficar negativo');
            }

            transaction.update(docRef, {
                quantidade: novaQuantidade,
                atualizadoEm: new Date()
            });
        });
    }
}
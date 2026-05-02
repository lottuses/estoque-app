import { Injectable } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    collectionData,
    doc,
    deleteDoc,
    updateDoc
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Orcamento, StatusOrcamento } from '../models/orcamento.model';

@Injectable({
    providedIn: 'root'
})
export class OrcamentoService {

    private colecao;

    constructor(private firestore: Firestore) {
        this.colecao = collection(this.firestore, 'orcamentos');
    }

    // 🔹 CRIAR
    criar(orcamento: Orcamento) {
        const dados = this.sanitize(orcamento);
        return addDoc(this.colecao, dados);
    }

    // 🔹 LISTAR
    listar(): Observable<Orcamento[]> {
        return collectionData(this.colecao, { idField: 'id' }) as Observable<Orcamento[]>;
    }

    // 🔹 EXCLUIR
    excluir(id: string) {
        const docRef = doc(this.firestore, `orcamentos/${id}`);
        return deleteDoc(docRef);
    }

    // 🔹 ATUALIZAR STATUS (tipado corretamente)
    atualizarStatus(id: string, status: StatusOrcamento) {
        const docRef = doc(this.firestore, `orcamentos/${id}`);
        return updateDoc(docRef, { status });
    }

    // 🔹 ATUALIZAR COMPLETO (já deixa pronto pra edição futura)
    atualizar(id: string, dados: Partial<Orcamento>) {
        const docRef = doc(this.firestore, `orcamentos/${id}`);
        return updateDoc(docRef, this.sanitize(dados));
    }

    // 🔥 FUNÇÃO ANTI-UNDEFINED (ESSENCIAL)
    private sanitize(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(v => this.sanitize(v));
        }

        if (obj !== null && typeof obj === 'object') {
            const novo: any = {};

            Object.keys(obj).forEach(key => {
                const valor = obj[key];

                if (valor !== undefined) {
                    novo[key] = this.sanitize(valor);
                }
            });

            return novo;
        }

        return obj;
    }
}
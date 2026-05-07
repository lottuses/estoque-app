import { Injectable } from '@angular/core';

import {
    Firestore,
    collection,
    addDoc,
    collectionData,
    doc,
    deleteDoc,
    updateDoc,
    docData
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import {
    Orcamento,
    StatusOrcamento
} from '../models/orcamento.model';

@Injectable({
    providedIn: 'root'
})
export class OrcamentoService {

    private colecao;

    constructor(private firestore: Firestore) {

        this.colecao = collection(
            this.firestore,
            'orcamentos'
        );

    }

    // 🔹 CRIAR
    criar(orcamento: Orcamento) {

        const dados = this.sanitize(orcamento);

        return addDoc(this.colecao, dados);

    }

    // 🔹 LISTAR
    listar(): Observable<Orcamento[]> {

        return collectionData(
            this.colecao,
            { idField: 'id' }
        ) as Observable<Orcamento[]>;

    }

    // 🔹 BUSCAR POR ID
    buscarPorId(id: string): Observable<Orcamento> {

        const docRef = doc(
            this.firestore,
            `orcamentos/${id}`
        );

        return docData(
            docRef,
            { idField: 'id' }
        ) as Observable<Orcamento>;

    }

    // 🔹 EXCLUIR
    excluir(id: string) {

        const docRef = doc(
            this.firestore,
            `orcamentos/${id}`
        );

        return deleteDoc(docRef);

    }

    // 🔹 ATUALIZAR STATUS
    atualizarStatus(
        id: string,
        status: StatusOrcamento
    ) {

        const docRef = doc(
            this.firestore,
            `orcamentos/${id}`
        );

        return updateDoc(docRef, {
            status,
            dataAtualizacao: new Date()
        });

    }

    // 🔹 FINALIZAR VENDA
    finalizar(id: string) {

        const docRef = doc(
            this.firestore,
            `orcamentos/${id}`
        );

        return updateDoc(docRef, {
            status: 'finalizado',
            dataFinalizacao: new Date(),
            dataAtualizacao: new Date()
        });

    }

    // 🔹 ATUALIZAR COMPLETO
    atualizar(
        id: string,
        dados: Partial<Orcamento>
    ) {

        const docRef = doc(
            this.firestore,
            `orcamentos/${id}`
        );

        return updateDoc(
            docRef,
            this.sanitize({
                ...dados,
                dataAtualizacao: new Date()
            })
        );

    }

    private sanitize(obj: any): any {

        // 🔹 Date
        if (obj instanceof Date) {
            return obj;
        }

        // 🔹 Array
        if (Array.isArray(obj)) {
            return obj.map(v => this.sanitize(v));
        }

        // 🔹 Objeto
        if (
            obj !== null &&
            typeof obj === 'object'
        ) {

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
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Orcamento } from '../models/orcamento.model';

@Injectable({
    providedIn: 'root'
})
export class OrcamentoService {

    private colecao = collection(this.firestore, 'orcamentos');

    constructor(private firestore: Firestore) { }

    criar(orcamento: Orcamento) {
        return addDoc(this.colecao, orcamento);
    }

    listar(): Observable<Orcamento[]> {
        return collectionData(this.colecao, { idField: 'id' }) as Observable<Orcamento[]>;
    }

    excluir(id: string) {
        const docRef = doc(this.firestore, `orcamentos/${id}`);
        return deleteDoc(docRef);
    }

    atualizarStatus(id: string, status: string) {
        const docRef = doc(this.firestore, `orcamentos/${id}`);
        return updateDoc(docRef, { status });
    }
}
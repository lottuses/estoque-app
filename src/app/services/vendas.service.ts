import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Venda } from '../models/venda.model';

@Injectable({
    providedIn: 'root'
})
export class VendaService {

    private colecao = collection(this.firestore, 'vendas');

    constructor(private firestore: Firestore) { }

    adicionarVenda(venda: Venda) {
        return addDoc(this.colecao, venda);
    }

    listarVendas(): Observable<Venda[]> {
        return collectionData(this.colecao, { idField: 'id' }) as Observable<Venda[]>;
    }
}
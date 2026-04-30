import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class SuporteService {

    constructor(private firestore: Firestore) { }

    async enviarMensagem(mensagem: string) {
        const suporteRef = collection(this.firestore, 'suporte');

        return await addDoc(suporteRef, {
            mensagem: mensagem,
            data: new Date(),
            status: 'aberto'
        });
    }
}
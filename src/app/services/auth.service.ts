import { Injectable, inject } from '@angular/core';

import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    user
} from '@angular/fire/auth';

import {
    Firestore,
    doc,
    setDoc
} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private auth = inject(Auth);
    private firestore = inject(Firestore);

    usuario$ = user(this.auth);

    async cadastrar(
        email: string,
        senha: string
    ) {

        const credencial = await createUserWithEmailAndPassword(
            this.auth,
            email,
            senha
        );

        const uid = credencial.user.uid;

        await setDoc(doc(this.firestore, 'usuarios', uid), {
            uid,
            email,
            criadoEm: new Date()
        });

    }

    login(email: string, senha: string) {
        return signInWithEmailAndPassword(
            this.auth,
            email,
            senha
        );
    }

    logout() {
        return signOut(this.auth);
    }

}
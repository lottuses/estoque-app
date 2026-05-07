import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';

import { routes } from './app/app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
    provideFirestore,
    getFirestore,
    enableIndexedDbPersistence
} from '@angular/fire/firestore';

import {
    provideAuth,
    getAuth
} from '@angular/fire/auth';

import { environment } from './environments/environment';

import { provideIonicAngular } from '@ionic/angular/standalone';

bootstrapApplication(AppComponent, {
    providers: [
        provideIonicAngular(),
        provideRouter(routes),
        provideAuth(() => getAuth()),

        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),

        provideFirestore(() => {
            const firestore = getFirestore();

            enableIndexedDbPersistence(firestore)
                .then(() => {
                    console.log('🔥 Persistência offline ativada');
                })
                .catch((err) => {
                    if (err.code === 'failed-precondition') {
                        console.warn('⚠️ Múltiplas abas abertas, persistência não ativada');
                    } else if (err.code === 'unimplemented') {
                        console.warn('⚠️ Navegador não suporta persistência offline');
                    }
                });

            return firestore;
        })
    ]
});
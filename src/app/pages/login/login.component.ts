import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { IonContent } from "@ionic/angular/standalone";


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [IonContent,
        CommonModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    // LOGIN
    loginEmail = '';
    loginSenha = '';

    // CADASTRO
    cadastroEmail = '';
    cadastroSenha = '';

    carregando = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    async login() {

        try {

            this.carregando = true;

            await this.authService.login(
                this.loginEmail,
                this.loginSenha
            );

            this.router.navigate(['/dashboard/infos']);

        } catch (erro: any) {

            console.error(erro);

        } finally {

            this.carregando = false;

        }

    }

    async cadastrar() {

        try {

            this.carregando = true;

            await this.authService.cadastrar(
                this.cadastroEmail,
                this.cadastroSenha
            );

            alert('Conta criada com sucesso');

        } catch (erro: any) {

            console.error(erro);

            alert('Erro ao cadastrar');

        } finally {

            this.carregando = false;

        }

    }

}
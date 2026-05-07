import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    // LOGIN
    loginEmail = '';
    loginSenha = '';

    // CADASTRO
    cadastroNome = '';
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

            alert('Login realizado');

            this.router.navigate(['/dashboard']);

        } catch (erro: any) {

            alert('Email ou senha inválidos');

            console.error(erro);

        } finally {

            this.carregando = false;

        }

    }

    async cadastrar() {

        try {

            this.carregando = true;

            await this.authService.cadastrar(
                this.cadastroNome,
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
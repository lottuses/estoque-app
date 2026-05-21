import { Component } from '@angular/core';

import {
    Router,
    RouterModule
} from '@angular/router';

import {
    IonContent
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';

import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        CommonModule,
        RouterModule,
        IonContent
    ]
})
export class DashboardComponent {

    menuAberto = false;

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    toggleMenu() {

        this.menuAberto = !this.menuAberto;

    }

    async logout() {

        await this.authService.logout();

        this.router.navigate(['/login']);

    }

}
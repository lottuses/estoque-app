import { Component, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [RouterModule],

})
export class DashboardComponent implements OnInit {

    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() { }


    async logout() {

        await this.authService.logout();

        this.router.navigate(['/login']);

    }

}


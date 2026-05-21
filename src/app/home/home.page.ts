import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
    IonContent
} from '@ionic/angular/standalone';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        RouterModule
    ]
})
export class HomePage {

    @ViewChild(IonContent)
    content!: IonContent;

    constructor() { }

    async scrollTo(id: string) {

        const element = document.getElementById(id);

        if (!element) return;

        const y = element.offsetTop - 80;

        await this.content.scrollToPoint(
            0,
            y,
            700
        );

    }

}
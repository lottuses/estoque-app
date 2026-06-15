import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        RouterModule // Essencial para o routerLink funcionar no standalone
    ]
})
export class HomePage {

    @ViewChild(IonContent)
    content!: IonContent;

    // CORREÇÃO: Declaração explícita da variável que o HTML estava cobrando
    menuAtivo: boolean = false;

    constructor() { }

    // Funções de controle do Menu Hambúrguer
    toggleMenu() {
        this.menuAtivo = !this.menuAtivo;
    }

    closeMenu() {
        this.menuAtivo = false;
    }

    ionViewDidEnter() {
        // Inicializa o efeito de scroll lateral com delay seguro
        setTimeout(() => {
            this.initTypeScriptScrollAnimation();
        }, 300);
    }

    initTypeScriptScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;
                    const isLeft = element.classList.contains('scroll-left');
                    const startX = isLeft ? '-60px' : '60px';

                    element.animate([
                        { opacity: 0, transform: `translateX(${startX})` },
                        { opacity: 1, transform: 'translateX(0)' }
                    ], {
                        duration: 800,
                        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                        fill: 'forwards'
                    });

                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.15
        });

        const elements = document.querySelectorAll('.scroll-left, .scroll-right');
        elements.forEach((el) => observer.observe(el));
    }

    // Efeito 1: Zoom Magnético do Hero (2x)
    onMouseMove(e: MouseEvent) {
        const container = e.currentTarget as HTMLElement;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        container.style.setProperty('--x', `${x}%`);
        container.style.setProperty('--y', `${y}%`);
    }

    onMouseLeave(e: MouseEvent) {
        const container = e.currentTarget as HTMLElement;
        if (!container) return;

        container.style.setProperty('--x', '50%');
        container.style.setProperty('--y', '50%');
    }

    // Efeito 2: Zoom Sutil das Categorias (1.15x)
    onPortfolioMouseMove(e: MouseEvent) {
        const container = e.currentTarget as HTMLElement;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        container.style.setProperty('--px', `${x}%`);
        container.style.setProperty('--py', `${y}%`);
    }

    onPortfolioMouseLeave(e: MouseEvent) {
        const container = e.currentTarget as HTMLElement;
        if (!container) return;

        container.style.setProperty('--px', '50%');
        container.style.setProperty('--py', '50%');
    }

    // Links de Scroll do Menu
    async scrollTo(id: string) {
        this.closeMenu(); // Garante que o menu mobile fecha ao clicar em uma seção
        
        const element = document.getElementById(id);
        if (!element) return;

        const y = element.offsetTop - 80;
        await this.content.scrollToPoint(0, y, 700);
    }
}
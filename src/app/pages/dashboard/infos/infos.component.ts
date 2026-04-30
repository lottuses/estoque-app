import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SuporteService } from 'src/app/services/suporte.service';

@Component({
    selector: 'app-info',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './infos.component.html',
    styleUrls: ['./infos.component.scss']
})
export class InfosComponent {

    mensagemAjuda: string = '';
    mensagemEnviada: boolean = false;
    carregando: boolean = false;

    constructor(private suporteService: SuporteService) { }

    async enviarAjuda() {
        if (!this.mensagemAjuda.trim()) {
            alert('Descreva o problema antes de enviar.');
            return;
        }

        try {
            this.carregando = true;

            await this.suporteService.enviarMensagem(this.mensagemAjuda);

            this.mensagemAjuda = '';
            this.mensagemEnviada = true;

            setTimeout(() => {
                this.mensagemEnviada = false;
            }, 3000);

        } catch (error) {
            console.error('Erro ao enviar:', error);
            alert('Erro ao enviar solicitação.');
        } finally {
            this.carregando = false;
        }
    }
}
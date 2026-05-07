import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { OrcamentoService } from 'src/app/services/orcamento.service';

import { Orcamento } from 'src/app/models/orcamento.model';

@Component({
    selector: 'app-nota-fiscal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './nota-fiscal.component.html',
    styleUrls: ['./nota-fiscal.component.scss'],
})
export class NotaFiscalComponent implements OnInit {

    orcamento!: Orcamento;

    carregando = true;

    constructor(
        private route: ActivatedRoute,
        private orcamentoService: OrcamentoService
    ) { }

    ngOnInit() {

        const id = this.route.snapshot.paramMap.get('id');

        if (!id) return;

        this.orcamentoService
            .buscarPorId(id)
            .subscribe(data => {

                // 🔥 CONVERTE TUDO AUTOMATICAMENTE
                this.orcamento = this.converterTimestamps(data);

                this.carregando = false;

            });

    }

    imprimir() {
        window.print();
    }

    // 🔥 CONVERSOR GLOBAL
    private converterTimestamps(obj: any): any {

        // ARRAY
        if (Array.isArray(obj)) {
            return obj.map(item =>
                this.converterTimestamps(item)
            );
        }

        // FIRESTORE TIMESTAMP
        if (obj?.toDate) {
            return obj.toDate();
        }

        // OBJETO
        if (
            obj !== null &&
            typeof obj === 'object'
        ) {

            const novo: any = {};

            Object.keys(obj).forEach(key => {

                novo[key] = this.converterTimestamps(
                    obj[key]
                );

            });

            return novo;
        }

        return obj;
    }

    get dataFinalizacaoFormatada(): Date | null {

        const data: any = this.orcamento?.dataFinalizacao;

        if (!data) return null;

        // Timestamp Firebase
        if (data?.toDate) {
            return data.toDate();
        }

        return data;
    }
}
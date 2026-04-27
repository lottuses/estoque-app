import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { OrcamentoService } from 'src/app/services/orcamento.service';
import { Orcamento } from 'src/app/models/orcamento.model';

@Component({
    selector: 'app-orcamentos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orcamento.component.html',
    styleUrls: ['./orcamento.component.scss'],
})
export class OrcamentoComponent implements OnInit {

    orcamentos$!: Observable<Orcamento[]>;

    constructor(private orcamentoService: OrcamentoService) { }

    ngOnInit() {
        this.orcamentos$ = this.orcamentoService.listar();
    }

    aprovar(orcamento: Orcamento) {
        if (!orcamento.id) return;
        this.orcamentoService.atualizarStatus(orcamento.id, 'aprovado');
    }

    excluir(id: string | undefined) {
        if (!id) return;
        this.orcamentoService.excluir(id);
    }
}
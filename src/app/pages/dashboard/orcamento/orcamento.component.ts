import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';

import { OrcamentoService } from 'src/app/services/orcamento.service';
import { Orcamento } from 'src/app/models/orcamento.model';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
    selector: 'app-orcamentos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orcamento.component.html',
    styleUrls: ['./orcamento.component.scss'],
})
export class OrcamentoComponent {

    orcamentos$: Observable<Orcamento[]>;

    constructor(
        private orcamentoService: OrcamentoService,
        private produtoService: ProdutoService,
        private router: Router
    ) {
        this.orcamentos$ = this.orcamentoService.listar().pipe(
            map(orcamentos =>
                orcamentos
                    .map(o => ({
                        ...o,
                        dataCriacao: this.converterData(o.dataCriacao)
                    }))
                    .sort((a, b) => this.ordenarPorData(a, b))
            )
        );
    }

    // 🔹 Ordenação isolada (mais limpo)
    private ordenarPorData(a: Orcamento, b: Orcamento): number {
        return b.dataCriacao.getTime() - a.dataCriacao.getTime();
    }

    //PRECISA CRIAR LOGICA PARA NUMERO NOTA. 
    gerarNumeroNota(): string {
        return 'NF-' + Date.now();
    }

    // 🔹 Navegação (ESSENCIAL pro seu fluxo)
    abrirOrcamento(orc: Orcamento) {
        if (!orc.id) return;

        this.router.navigate(['/dashboard/orcamento', orc.id]);
    }

    private converterData(data: any): Date {
        if (!data) return new Date();

        // Firestore Timestamp
        if (typeof data.toDate === 'function') {
            return data.toDate();
        }

        // Já é Date
        if (data instanceof Date) {
            return data;
        }

        // String ou número
        return new Date(data);
    }

    // 🔹 Aprovar
    async aprovar(orcamento: Orcamento) {

        if (!orcamento.id) return;

        if (orcamento.status === 'finalizado') return;

        try {

            // 🔹 1. Atualizar estoque
            for (const item of orcamento.itens) {
                await this.produtoService.baixarEstoque(
                    item.produtoId,
                    item.quantidade
                );
            }

            // 🔹 2. Atualizar orçamento
            await this.orcamentoService.atualizar(orcamento.id, {
                status: 'finalizado',
                dataFinalizacao: new Date(),
                numeroNota: this.gerarNumeroNota()
            });

            console.log('✅ Venda finalizada');

        } catch (err) {
            console.error('❌ Erro ao finalizar venda:', err);
        }
    }

    // 🔹 Excluir
    async excluir(id?: string) {
        if (!id) return;

        if (!confirm('Deseja excluir este orçamento?')) return;

        try {
            await this.orcamentoService.excluir(id);
            console.log('🗑️ Orçamento excluído');
        } catch (err) {
            console.error('❌ Erro ao excluir:', err);
        }
    }

    // 🔹 Helpers
    getTotalItens(orc: Orcamento): number {
        return orc.itens.reduce((total, item) => total + item.quantidade, 0);
    }

    getValorTotal(orc: Orcamento): number {
        return orc.itens.reduce((total, item) =>
            total + (item.preco * item.quantidade), 0
        );
    }

    // 🔹 Performance
    trackByOrcamento(index: number, item: Orcamento) {
        return item.id;
    }

    trackByItem(
        index: number,
        item: { produtoId: string }
    ) {
        return item.produtoId;
    }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { OrcamentoService } from 'src/app/services/orcamento.service';
import { ProdutoService } from 'src/app/services/produto.service';

import { Orcamento } from 'src/app/models/orcamento.model';

@Component({
    selector: 'app-orcamento-item',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './orcamento-item.component.html',
    styleUrls: ['./orcamento-item.component.scss'],
})
export class OrcamentoItemComponent implements OnInit {

    orcamento!: Orcamento;
    id!: string;

    carregando = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private orcamentoService: OrcamentoService,
        private produtoService: ProdutoService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id')!;

        this.orcamentoService.listar().subscribe(lista => {
            const encontrado = lista.find(o => o.id === this.id);

            if (!encontrado) {
                this.router.navigate(['/orcamentos']);
                return;
            }

            this.orcamento = JSON.parse(JSON.stringify(encontrado)); // 🔥 evita mutação direta
            this.calcularTotal();
            this.carregando = false;
        });
    }

    calcularTotal() {
        const subtotal = this.orcamento.itens.reduce(
            (acc, i) => acc + (i.preco * i.quantidade),
            0
        );

        this.orcamento.subtotal = subtotal;
        this.orcamento.total = subtotal - (this.orcamento.desconto || 0);
    }

    alterarQuantidade(index: number, mudanca: number) {
    const item = this.orcamento.itens[index];
    const novaQuantidade = item.quantidade + mudanca;

    // Garante que a quantidade não seja menor que 1
    if (novaQuantidade >= 1) {
        item.quantidade = novaQuantidade;
    }
}

    removerItem(index: number) {
        this.orcamento.itens.splice(index, 1);
        this.calcularTotal();
    }

    salvar() {
        if (!this.orcamento.id) return;

        this.orcamentoService.atualizar(this.orcamento.id, this.orcamento)
            .then(() => alert('✅ Orçamento atualizado'))
            .catch(err => console.error(err));
    }

    async finalizar() {
        if (!this.orcamento.id) return;

        try {
            for (const item of this.orcamento.itens) {
                await this.produtoService.baixarEstoque(
                    item.produtoId,
                    item.quantidade
                );
            }

            await this.orcamentoService.atualizar(this.orcamento.id, {
                status: 'finalizado',
                dataFinalizacao: new Date(),
                numeroNota: 'NF-' + Date.now()
            });

            alert('✅ Venda finalizada');
            this.router.navigate(['/orcamentos']);

        } catch (err) {
            alert('❌ Erro ao finalizar venda');
            console.error(err);
        }
    }
}
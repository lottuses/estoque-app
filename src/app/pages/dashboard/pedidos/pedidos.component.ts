import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    Observable,
    BehaviorSubject,
    combineLatest,
    map,
    take
} from 'rxjs';

import { FormsModule } from '@angular/forms';

import { CarrinhoService } from 'src/app/services/carrinho.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';

import { ItemCarrinho } from 'src/app/models/itemCarrinho.model';
import { Produto } from 'src/app/models/produto.model';
import { Orcamento } from 'src/app/models/orcamento.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './pedidos.component.html',
    styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent {

    itens$: Observable<ItemCarrinho[]>;
    produtosFiltrados$: Observable<Produto[]>;
    total$: Observable<number>;

    private buscaSubject = new BehaviorSubject<string>('');

    // 🔹 CLIENTE
    cliente = {
        nome: '',
        telefone: '',
        endereco: ''
    };

    // 🔹 PAGAMENTO
    tipoPagamento: 'pix' | 'dinheiro' | 'cartao' = 'pix';

    parcelas: number = 1;

    desconto: number = 0;

    constructor(
        private carrinhoService: CarrinhoService,
        private produtoService: ProdutoService,
        private orcamentoService: OrcamentoService,
        private router:Router
    ) {

        // 🔹 ITENS
        this.itens$ = this.carrinhoService.itens$;

        // 🔹 TOTAL
        this.total$ = this.itens$.pipe(
            map(itens =>
                itens.reduce(
                    (acc, item) => acc + (item.preco * item.quantidade),
                    0
                )
            )
        );

        // 🔹 FILTRO DE PRODUTOS
        this.produtosFiltrados$ = combineLatest([
            this.produtoService.listar(),
            this.buscaSubject
        ]).pipe(
            map(([produtos, busca]) =>
                produtos.filter(p =>
                    p.nome.toLowerCase().includes(busca.toLowerCase())
                )
            )
        );
    }

    // 🔍 BUSCA
    onBuscar(valor: string) {
        this.buscaSubject.next(valor);
    }

    // ➕ ADICIONAR
    adicionar(produto: Produto) {
        this.carrinhoService.adicionarItem({
            produtoId: produto.id!,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1,
            estoqueDisponivel: produto.quantidade,
            imagem: produto.imagem
        });
    }

    // 🔼 AUMENTAR
    aumentar(item: ItemCarrinho) {
        const novaQuantidade = item.quantidade + 1;
        this.carrinhoService.alterarQuantidade(
            item.produtoId,
            novaQuantidade
        );
    }

    // 🔽 DIMINUIR
    diminuir(item: ItemCarrinho) {
        if (item.quantidade <= 1) return;

        const novaQuantidade = item.quantidade - 1;

        this.carrinhoService.alterarQuantidade(
            item.produtoId,
            novaQuantidade
        );
    }

    // 🔢 ALTERAR INPUT
    alterar(item: ItemCarrinho, event: Event) {
        const input = event.target as HTMLInputElement;

        const quantidade = Number(input.value);

        if (quantidade < 1) return;

        this.carrinhoService.alterarQuantidade(
            item.produtoId,
            quantidade
        );
    }

    // ❌ REMOVER
    remover(item: ItemCarrinho) {
        this.carrinhoService.removerItem(item.produtoId);
    }

    // 🔥 GERAR ORÇAMENTO
    gerarOrcamento() {

        this.itens$.pipe(take(1)).subscribe(itens => {

            if (itens.length === 0) {
                alert('Carrinho vazio');
                return;
            }

            if (!this.cliente.nome.trim()) {
                alert('Informe o nome do cliente');
                return;
            }

            const subtotal = itens.reduce(
                (acc, item) =>
                    acc + (item.preco * item.quantidade),
                0
            );

            const total = subtotal - this.desconto;

            const orcamento: Orcamento = {

                cliente: {
                    nome: this.cliente.nome,
                    endereco: this.cliente.endereco || null
                },

                itens: itens.map(item => ({
                    produtoId: item.produtoId,
                    nome: item.nome,
                    preco: item.preco,
                    quantidade: item.quantidade,
                    imagem: item.imagem || null
                })),

                total,

                subtotal,

                desconto: this.desconto,

                tipoPagamento: this.tipoPagamento,

                status: 'rascunho',

                dataCriacao: new Date()
            };

            this.orcamentoService.criar(orcamento)
                .then(() => {

                    console.log('✅ Orçamento salvo');

                    this.carrinhoService.limparCarrinho();

                    // 🔹 RESET
                    this.cliente = {
                        nome: '',
                        telefone: '',
                        endereco: ''
                    };

                    this.desconto = 0;
                    this.parcelas = 1;
                    this.tipoPagamento = 'pix';

                    this.router.navigate(['/dashboard/orcamento']);


                })
                .catch(err => {
                    console.error('❌ Erro ao salvar orçamento:', err);
                });


        });
    }

    // 🔹 TRACK BY
    trackById(index: number, item: any) {
        return item.id || item.produtoId;
    }
}
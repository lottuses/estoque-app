import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest, map, take } from 'rxjs';

import { CarrinhoService } from 'src/app/services/carrinho.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';

import { ItemCarrinho } from 'src/app/models/itemCarrinho.model';
import { Produto } from 'src/app/models/produto.model';
import { Orcamento } from 'src/app/models/orcamento.model';
import { FormsModule } from '@angular/forms';

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
    cliente = {
        nome: '',
        telefone: '',
        endereco: ''
    };

    private buscaSubject = new BehaviorSubject<string>('');

    constructor(
        private carrinhoService: CarrinhoService,
        private produtoService: ProdutoService,
        private orcamentoService: OrcamentoService

        
    ) {


        

        this.itens$ = this.carrinhoService.itens$;

        this.total$ = this.itens$.pipe(
            map(itens =>
                itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0)
            )
        );

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

    aumentar(item: ItemCarrinho) {
        const novaQuantidade = item.quantidade + 1;
        this.carrinhoService.alterarQuantidade(item.produtoId, novaQuantidade);
    }

    /**
     * Decrementa a quantidade de um item no carrinho, 
     * respeitando o limite mínimo de 1 unidade
     */
    diminuir(item: ItemCarrinho) {
        if (item.quantidade > 1) {
            const novaQuantidade = item.quantidade - 1;
            this.carrinhoService.alterarQuantidade(item.produtoId, novaQuantidade);
        }
    }

    onBuscar(valor: string) {
        this.buscaSubject.next(valor);
    }

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

    alterar(item: ItemCarrinho, event: Event) {
        const input = event.target as HTMLInputElement;
        const quantidade = Number(input.value);

        if (quantidade < 1) return;

        this.carrinhoService.alterarQuantidade(item.produtoId, quantidade);
    }

    remover(item: ItemCarrinho) {
        this.carrinhoService.removerItem(item.produtoId);
    }

    // 🔥 GERAR ORÇAMENTO CORRIGIDO
    gerarOrcamento() {

        this.itens$.pipe(take(1)).subscribe(itens => {

            if (itens.length === 0) return;

            const itensFormatados = itens.map(item => ({
                produtoId: item.produtoId,
                nome: item.nome,
                preco: item.preco,
                quantidade: item.quantidade,
                imagem: item.imagem || null
            }));

            const subtotal = itens.reduce(
                (acc, i) => acc + (i.preco * i.quantidade),
                0
            );

            const desconto = 0;

            const orcamento: Orcamento = {
                cliente: {
                    nome: this.cliente.nome || 'Sem nome',
                    telefone: this.cliente.telefone || '',
                    endereco: this.cliente.endereco || null
                },

                itens: itensFormatados,

                subtotal,
                desconto,
                total: subtotal - desconto,

                tipoPagamento: undefined,

                status: 'rascunho',

                dataCriacao: new Date(),
                dataAtualizacao: new Date()
            };

            if (!this.cliente.nome.trim()) {
                alert('Informe o nome do cliente');
                return;
            }

            this.orcamentoService.criar(orcamento)
                .then(() => {
                    console.log('✅ Orçamento salvo');
                    this.carrinhoService.limparCarrinho();
                })
                .catch(err => console.error(err));

            this.cliente = {
                nome: '',
                telefone: '',
                endereco: ''
            };

        });
    }

    trackById(index: number, item: any) {
        return item.id || item.produtoId;
    }
}


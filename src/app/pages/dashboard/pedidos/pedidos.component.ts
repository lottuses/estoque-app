import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { CarrinhoService } from 'src/app/services/carrinho.service';
import { ProdutoService } from 'src/app/services/produto.service';

import { ItemCarrinho } from 'src/app/models/itemCarrinho.model';
import { Produto } from 'src/app/models/produto.model';

import { BehaviorSubject, combineLatest, map } from 'rxjs';

import { OrcamentoService } from 'src/app/services/orcamento.service';
import { Orcamento } from 'src/app/models/orcamento.model';



@Component({
    selector: 'app-pedidos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './pedidos.component.html',
    styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

    itens$!: Observable<ItemCarrinho[]>;
    produtos$!: Observable<Produto[]>;
    private buscaSubject = new BehaviorSubject<string>('');
    produtosFiltrados$!: Observable<Produto[]>;


    constructor(
        private carrinhoService: CarrinhoService,
        private produtoService: ProdutoService,
        private orcamentoService: OrcamentoService
    ) { }

    ngOnInit() {

        this.itens$ = this.carrinhoService.itens$;

        const produtos$ = this.produtoService.listar();

        this.produtosFiltrados$ = combineLatest([
            produtos$,
            this.buscaSubject
        ]).pipe(
            map(([produtos, busca]) =>
                produtos.filter(p =>
                    p.nome.toLowerCase().includes(busca.toLowerCase())
                )
            )
        );
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

    alterar(item: ItemCarrinho, event: any) {
        const quantidade = Number(event.target.value);
        this.carrinhoService.alterarQuantidade(item.produtoId, quantidade);
    }

    remover(item: ItemCarrinho) {
        this.carrinhoService.removerItem(item.produtoId);
    }

    get total() {
        return this.carrinhoService.getTotal();
    }

    gerarOrcamento() {
        const itensCarrinho = this.carrinhoService.getItens();

        if (itensCarrinho.length === 0) return;
        
        console.log(itensCarrinho)

        const itens = itensCarrinho.map(item => ({
            produtoId: item.produtoId,
            nome: item.nome,
            preco: item.preco,
            quantidade: item.quantidade,
            imagem: item.imagem || null
        }));

        const orcamento = {
            itens,
            total: this.carrinhoService.getTotal(),
            status: 'rascunho' as const,
            data: new Date()
        };

        this.orcamentoService.criar(orcamento)
            .then(() => {
                console.log('✅ Orçamento salvo');
                this.carrinhoService.limparCarrinho();
            })
            .catch(err => console.error(err));
    }
}
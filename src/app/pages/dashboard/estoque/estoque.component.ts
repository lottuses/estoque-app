import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProdutoService } from 'src/app/services/produto.service';
import { PRODUTOS_MOCK } from 'src/app/mocks/produtos.mock';
import { Produto } from 'src/app/models/produto.model';

@Component({
    selector: 'app-estoque',
    standalone: true,
    templateUrl: './estoque.component.html',
    styleUrls: ['./estoque.component.scss'],
    imports: [FormsModule, CommonModule]
})
export class EstoqueComponent implements OnInit {

    produtos: Produto[] = [];
    produtosFiltrados: Produto[] = [];

    mostrarModal = false;
    editando = false;

    produto: Produto = this.getProdutoVazio();

    idEditando: string | null = null;

    filtroCategoria:
        | ''
        | 'ferragem'
        | 'ferramenta'
        | 'material de construcao'
        | 'eletrica' = '';

    busca = '';

    constructor(
        private produtoService: ProdutoService
    ) { }

    async importarMock() {

        try {

            for (const produto of PRODUTOS_MOCK) {

                await this.produtoService.adicionar(produto);
            }

            console.log('✅ Produtos importados');

        } catch (erro) {

            console.error('❌ Erro ao importar:', erro);
        }
    }

    ngOnInit() {

        this.produtoService.listar().subscribe(data => {

            this.produtos = data;

            this.aplicarFiltros();
        });
    }

    // 🔥 PRODUTO PADRÃO
    getProdutoVazio(): Produto {

        return {

            // IDENTIFICAÇÃO
            codigo: '',
            codigoFornecedor: '',
            codigoBarras: '',

            // DADOS
            nome: '',

            categoria: 'ferragem',

            tipo: '',

            marca: '',

            especificacao: '',

            // ESTOQUE
            quantidade: 0,
            estoqueMinimo: 0,

            unidade: '',
            localizacao: '',

            // FINANCEIRO
            precoCompra: 0,
            precoVenda: 0,

            // MÍDIA
            imagem: '',
            erroImagem: false
        };
    }

    aplicarFiltros() {

        this.produtosFiltrados = this.produtos.filter(produto => {

            // 🔥 FILTRO CATEGORIA
            const matchCategoria =
                !this.filtroCategoria ||
                produto.categoria === this.filtroCategoria;

            // 🔥 BUSCA
            const textoBusca = this.busca.toLowerCase();

            const matchBusca =
                !this.busca ||

                produto.nome?.toLowerCase().includes(textoBusca) ||

                produto.codigo?.toLowerCase().includes(textoBusca) ||

                produto.codigoFornecedor?.toLowerCase().includes(textoBusca) ||

                produto.codigoBarras?.toLowerCase().includes(textoBusca) ||

                produto.marca?.toLowerCase().includes(textoBusca) ||

                produto.especificacao?.toLowerCase().includes(textoBusca);

            return matchCategoria && matchBusca;
        });
    }

    abrirModal() {

        this.mostrarModal = true;

        this.editando = false;

        this.produto = this.getProdutoVazio();

        this.idEditando = null;
    }

    // 1. Crie essa nova variável no topo do seu componente
fechandoModal = false;

// 2. Substitua a sua função fecharModal por esta:
fecharModal() {
  this.fechandoModal = true; // Ativa a animação de saída no CSS

  // Espera 200 milissegundos (o tempo da animação) antes de destruir o modal do DOM
  setTimeout(() => {
    this.mostrarModal = false;
    this.fechandoModal = false; // Reseta o estado para a próxima vez que abrir
  }, 200);
}

    async salvar() {

        try {

            if (this.editando && this.idEditando) {

                await this.produtoService.atualizar(
                    this.idEditando,
                    this.produto
                );

                console.log('✅ Produto atualizado');

            } else {

                await this.produtoService.adicionar(this.produto);

                console.log('✅ Produto criado');
            }

            this.fecharModal();

        } catch (erro) {

            console.error('❌ Erro ao salvar produto:', erro);
        }
    }

    editar(produto: Produto) {

        this.produto = {
            ...produto
        };

        this.idEditando = produto.id || null;

        this.editando = true;

        this.mostrarModal = true;
    }

    excluir(id: string | undefined) {

        if (!id) return;

        const confirmar = confirm(
            'Deseja realmente excluir este produto?'
        );

        if (!confirmar) return;

        this.produtoService.deletar(id);
    }

    // 🔥 STATUS ESTOQUE
    estoqueBaixo(produto: Produto): boolean {

        if (!produto.estoqueMinimo) return false;

        return produto.quantidade <= produto.estoqueMinimo;
    }

    // 🔥 FORMATA PREÇO
    formatarPreco(valor: number): string {

        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}
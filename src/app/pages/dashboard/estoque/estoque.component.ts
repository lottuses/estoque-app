import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from 'src/app/services/produto.service';
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

    filtroTipo: '' | 'ferragem' | 'ferramenta' = '';
    busca: string = '';

    constructor(private produtoService: ProdutoService) { }

    ngOnInit() {
        this.produtoService.listar().subscribe(data => {
            this.produtos = data;
            this.aplicarFiltros();
        });
    }

    // 🔥 evita repetir objeto hardcoded
    getProdutoVazio(): Produto {
        return {
            nome: '',
            tipo: 'ferragem',
            quantidade: 0,
            preco: 0 // 👈 OBRIGATÓRIO AGORA
        };
    }

    aplicarFiltros() {
        this.produtosFiltrados = this.produtos.filter(produto => {

            const matchTipo =
                !this.filtroTipo || produto.tipo === this.filtroTipo;

            const matchBusca =
                !this.busca ||
                produto.nome.toLowerCase().includes(this.busca.toLowerCase()) ||
                produto.especificacao?.toLowerCase().includes(this.busca.toLowerCase());

            return matchTipo && matchBusca;
        });
    }

    abrirModal() {
        this.mostrarModal = true;
        this.editando = false;
        this.produto = this.getProdutoVazio();
        this.idEditando = null;
    }

    fecharModal() {
        this.mostrarModal = false;
    }

    salvar() {
        if (this.editando && this.idEditando) {
            this.produtoService.atualizar(this.idEditando, this.produto);
        } else {
            this.produtoService.adicionar(this.produto)
                .then(() => console.log('✅ Salvou no Firestore'))
                .catch(err => console.error('❌ Erro ao salvar:', err));
        }

        this.fecharModal();
    }

    editar(produto: Produto) {
        this.produto = { ...produto };
        this.idEditando = produto.id || null;
        this.editando = true;
        this.mostrarModal = true;
    }

    excluir(id: string | undefined) {
        if (!id) return;
        this.produtoService.deletar(id);
    }
}


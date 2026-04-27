import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemCarrinho } from '../models/itemCarrinho.model';

@Injectable({
    providedIn: 'root'
})
export class CarrinhoService {

    private itens: ItemCarrinho[] = [];
    private itensSubject = new BehaviorSubject<ItemCarrinho[]>([]);

    itens$ = this.itensSubject.asObservable();

    // 🔹 Adicionar item
    adicionarItem(item: ItemCarrinho) {
        const existente = this.itens.find(i => i.produtoId === item.produtoId);

        if (existente) {
            if (existente.quantidade + 1 > existente.estoqueDisponivel) {
                console.warn('Estoque insuficiente');
                return;
            }
            existente.quantidade++;
        } else {
            this.itens.push({
                ...item,
                quantidade: 1
            });
        }

        this.atualizar();
    }

    // 🔹 Remover item
    removerItem(produtoId: string) {
        this.itens = this.itens.filter(i => i.produtoId !== produtoId);
        this.atualizar();
    }

    // 🔹 Alterar quantidade
    alterarQuantidade(produtoId: string, quantidade: number) {
        const item = this.itens.find(i => i.produtoId === produtoId);
        if (!item) return;

        if (quantidade <= 0) {
            this.removerItem(produtoId);
            return;
        }

        if (quantidade > item.estoqueDisponivel) {
            console.warn('Quantidade maior que estoque');
            return;
        }

        item.quantidade = quantidade;
        this.atualizar();
    }

    // 🔹 Limpar carrinho
    limparCarrinho() {
        this.itens = [];
        this.atualizar();
    }

    // 🔹 Total da compra
    getTotal(): number {
        return this.itens.reduce((total, item) =>
            total + (item.preco * item.quantidade), 0
        );
    }

    // 🔹 Quantidade total de itens (útil pra badge)
    getQuantidadeTotal(): number {
        return this.itens.reduce((total, item) =>
            total + item.quantidade, 0
        );
    }

    // 🔹 Pegar itens (necessário pro orçamento)
    getItens(): ItemCarrinho[] {
        return [...this.itens]; // cópia pra evitar mutação externa
    }

    // 🔹 Verifica se carrinho está vazio
    estaVazio(): boolean {
        return this.itens.length === 0;
    }

    // 🔹 Atualiza observable
    private atualizar() {
        this.itensSubject.next([...this.itens]);
    }
}
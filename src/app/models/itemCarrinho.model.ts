export interface ItemCarrinho {
    produtoId: string;
    nome: string;
    preco: number;
    quantidade: number;
    estoqueDisponivel: number;
    imagem?: string; // 👈 NOVO
}
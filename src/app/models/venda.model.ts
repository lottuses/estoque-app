export interface Venda {
    id?: string;

    cliente?: string;

    itens: {
        produtoId: string;
        nome: string;
        quantidade: number;
        preco: number;
    }[];

    total: number;

    data: Date;

    orcamentoId?: string; // rastreabilidade
}
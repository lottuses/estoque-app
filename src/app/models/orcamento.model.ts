export interface Orcamento {
    id?: string;

    itens: {
        produtoId: string;
        nome: string;
        preco: number;
        quantidade: number;
        imagem?: string | null; 
    }[];

    total: number;

    status: 'rascunho' | 'aprovado' | 'recusado';

    data: Date;
}
export type StatusOrcamento =
    | 'rascunho'
    | 'aprovado'
    | 'recusado'
    | 'finalizado';

export interface Orcamento {
    id?: string;

    // 🔹 CLIENTE
    cliente: {
        nome: string;
        telefone?: string;
        email?: string;
        endereco?: string | null;
    };

    // 🔹 ITENS
    itens: {
        produtoId: string;
        nome: string;
        preco: number;
        quantidade: number;
        imagem?: string | null;
    }[];

    // 🔹 VALORES
    subtotal: number;   // 🔥 NOVO (antes do desconto)
    desconto?: number;  // valor fixo em R$
    total: number;      // depois do desconto

    // 🔹 PAGAMENTO
    tipoPagamento?: 'dinheiro' | 'cartao' | 'pix';

    // 🔹 STATUS DO FLUXO
    status: 'rascunho' | 'aprovado' | 'recusado' | 'finalizado';

    // 🔹 CONTROLE DE TEMPO
    dataCriacao: Date;
    dataAtualizacao?: Date;

    // 🔹 VENDA (quando virar venda)
    dataFinalizacao?: Date;

    // 🔹 NOTA (futuro)
    numeroNota?: string;
}
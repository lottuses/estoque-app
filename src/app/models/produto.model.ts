export interface Produto {
    id?: string; // gerado pelo Firestore

    nome: string;
    tipo: 'ferragem' | 'ferramenta';

    especificacao?: string;

    quantidade: number;

    unidade?: string; // ex: un, caixa, metro

    localizacao?: string; // ex: prateleira A

    imagem?: string; // caminho local

    criadoEm?: Date;
    atualizadoEm?: Date;
}
export interface Produto {
    id?: string;

    nome: string;
    categoria: 'ferragem' | 'ferramenta' | 'material de construcao' | 'eletrica';

    tipo?: string,
    marca: string;
    especificacao?: string;

    quantidade: number;

    preco: number;

    unidade?: string;
    localizacao?: string;
    imagem?: string;

    criadoEm?: Date;
    atualizadoEm?: Date;
}
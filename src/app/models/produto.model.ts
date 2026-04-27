export interface Produto {
    id?: string;

    nome: string;
    tipo: 'ferragem' | 'ferramenta';

    especificacao?: string;

    quantidade: number;

    preco: number; // 👈 ADICIONA ISSO

    unidade?: string;
    localizacao?: string;
    imagem?: string;

    criadoEm?: Date;
    atualizadoEm?: Date;
}
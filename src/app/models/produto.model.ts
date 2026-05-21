export interface Produto {

    id?: string;

    // IDENTIFICAÇÃO
    codigo: string;
    codigoFornecedor?: string;
    codigoBarras?: string;

    nome: string;

    categoria:
    | 'ferragem'
    | 'ferramenta'
    | 'material de construcao'
    | 'eletrica';

    tipo?: string;

    marca: string;

    especificacao?: string;

    // ESTOQUE
    quantidade: number;
    estoqueMinimo?: number;

    unidade?: string;
    localizacao?: string;

    // FINANCEIRO
    precoCompra: number;
    precoVenda: number;

    // MÍDIA
    imagem?: string;
    erroImagem?: boolean;

    // DATAS
    criadoEm?: Date;
    atualizadoEm?: Date;
}
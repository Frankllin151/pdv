import { Produto } from "./produto";

export type Vendas = {
    id:number | null;
    totalprice:number;
    produtos: Produto[];
    quantities: { [key: number]: number };
    date: Date;
}
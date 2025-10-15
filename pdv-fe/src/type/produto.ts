export type Produto = {
  id: number ;
  nome: string;
  preco: number;
   imagemUrl: string | File | null; 
  quantidade: number |  null;
};

export type showProduto = {
   id: number ;
  nome: string;
  preco: number;
   imagemUrl: string 
  quantidade: number |  null;
}
import { Produto } from "./produto";
export  type EditProductDialogProps =  {
  product: Produto;
  onConfirmEdit: (id: number, updatedProduct: { nome: string; preco: number }) => void;
}
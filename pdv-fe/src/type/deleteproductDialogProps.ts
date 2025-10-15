import { Produto } from './produto';
export type DeleteProductDialogProps =  {
  product: Produto;
  onConfirmDelete: (id: number) => void;
}
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { EditProductDialogProps } from '@/type/EditProductDialogProps';
import { updateProduto } from '@/data/produto';
import { useToken } from '@/hooks/useToken';
export function EditProductDialog({ product, onConfirmEdit }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.nome);
  const [price, setPrice] = useState(product.preco.toString());
 const {token} = useToken();
 const handleSave = async () => {
  try {
    
     if (!token) {
      return;
     }
    const updatedProduct = await updateProduto(product.id, { nome: name, preco: parseFloat(price) }, token);
   console.log(product.id, updatedProduct);
   
    onConfirmEdit(product.id, updatedProduct); // atualiza a lista ou estado
    setOpen(false); // fecha o modal
  } catch (error: unknown) {
   if (error instanceof Error) {
      console.error("Erro no login:", error);
    } else {
      console.error("Erro desconhecido no login:", error);
    }
  }
};



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white hover:text-white"
        >
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias e clique em salvar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Preço
            </Label>
           <NumericFormat
      id="price"
      value={price}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      onValueChange={(values) => setPrice(values.value)} // valor cru (ex: 1234.56)
      customInput={Input}
      className="col-span-3"
    />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
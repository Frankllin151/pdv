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
import { Produto } from '@/type/produto';
import { NumericFormat } from 'react-number-format';
import { addProduto } from '@/data/produto';
import { useToken } from '@/hooks/useToken';
interface AddProductDialogProps {
  onAddProduct: (newProduct: Omit<Produto, 'id'>) => void;
}

export function AddProductDialog({ onAddProduct }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('0');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
const [fileName, setFileName] = useState<string | null>(null);
const [file, setFile] = useState<File | null>(null);
 const { token } = useToken();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    // Preview da imagem
    const tempUrl = URL.createObjectURL(selectedFile);
    setImageUrl(tempUrl);

    // Nome do arquivo
    setFileName(selectedFile.name);

    // Aqui você armazena a imagem real para enviar ao back-end
    setFile(selectedFile);
  }
};

  const handleSave = async () => {
    const numericPriceToSave = parseFloat(price);
    
    try {
       const newProduct = {
      nome: name,
      preco: numericPriceToSave,
      imagemUrl: file || null,
      quantidade: null
    };
    if(!token) return;
     const produtoCriado = await addProduto(newProduct, token);
     console.log("Produto cadastrado:", produtoCriado);
    }  catch(error){
       console.error(error);
    }

    setOpen(false);
  // Reseta o formulário
     setName('');
    setPrice('0');
    setFileName('');
    setFile(null)
   
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os campos para adicionar um novo produto ao estoque.
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
              onValueChange={(values) => setPrice(values.value || '0')}
              customInput={Input}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fileUpload" className="text-right">
              Imagem(Opcional)
            </Label>
            <div className="flex items-center col-span-3">
              <label htmlFor="fileUpload" className="cursor-pointer">
                <Button asChild>
                  <div>Selecionar Arquivo</div>
                </Button>
              </label>
              <input
                id="fileUpload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileName && <span className="ml-2 truncate text-sm text-gray-500">{fileName}</span>}
            </div>
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
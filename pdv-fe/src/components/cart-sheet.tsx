"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Produto } from '@/type/produto';
import { Vendas } from "@/type/vendas";
import { addVenda } from "@/data/vendas";
import { useToken } from "@/hooks/useToken";
import { toast } from "sonner"
// A tipagem CartSheetProps 
interface CartSheetProps {
    selectedProducts: Produto[];
  quantities: { [key: number]: number };
  totalPrice: number;
  onClearCart: () => void;
  onClose: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

// O componente agora recebe 'quantities' como uma propriedade
export function CartSheet({ 
 selectedProducts, 
  quantities, 
  totalPrice, 
  onClearCart, 
  onClose,
  isOpen,
  setIsOpen 
}: CartSheetProps) {
    const { token } = useToken();
  
    const handleFinalizePurchase = async  () => {

        const filteredQuantities: { [key: number]: number } = {};
       
        for (const id in quantities) {
            if (quantities[id] > 0) {
                filteredQuantities[id] = quantities[id];
            }
        }
    
        const newVenda: Vendas = {
            id: Date.now(), 
            totalprice: totalPrice,
            produtos: selectedProducts,
            quantities: filteredQuantities, 
            date: new Date(),
        };
        
         try {
   
      if(!token) return;

    const response = await addVenda(newVenda, token);
       console.log("Venda registrada com sucesso:", response)
   toast.success("Venda registrada com sucesso!", {
      description: `Valor total: R$ ${totalPrice.toFixed(2)}`,
    })

      onClearCart(); // limpa o carrinho aqui 
      onClose(); // fecha o sheet aqui
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
     toast.error("Erro ao registrar venda", {
      description: "Tente novamente em alguns segundos.",
    })
  }
    };
  
    
    
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button 
                
                className='bg-blue-500 hover:bg-blue-600 cursor-pointer'>Registrar</Button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Registrar Venda</SheetTitle>
                    <SheetDescription>
                        Revise a venda antes de confirmar.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-[calc(100vh-140px)] justify-between p-6">
                    <div className="py-4 space-y-4 overflow-y-auto pr-2">
                        {selectedProducts.length > 0 ? (
  selectedProducts.map(produto => {
    const imageSrc =
      produto.imagemUrl instanceof File
        ? URL.createObjectURL(produto.imagemUrl)
        : produto.imagemUrl || "/images/placeholder.png";

    return (
      <div key={produto.id} className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <Image 
            src={imageSrc}
            alt={produto.nome}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{produto.nome}</h4>
          <p className="text-sm text-gray-500">
            Quantidade: {quantities[produto.id]}
          </p>
        </div>
        <div className="text-right font-medium">
          R$ {(produto.preco * (quantities[produto.id] || 0)).toFixed(2)}
        </div>
      </div>
    );
  })
) : (
  <p className="text-gray-500 text-center mt-8">Nenhum produto selecionado.</p>
)}
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total da venda:</span>
                            <span>R$ {totalPrice.toFixed(2)}</span>
                        </div>
                        <Button  
                        onClick={handleFinalizePurchase}
                         className="mt-4 w-full bg-blue-500 hover:bg-blue-600">Confirma</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
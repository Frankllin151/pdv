"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Input } from '@/components/ui/input';
import { produtos as produtosData , produtoFetch} from '@/data/produto';
import { showProduto } from '@/type/produto';
import clsx from 'clsx';
import { CartSheet } from '@/components/cart-sheet';
import { useToken } from '@/hooks/useToken';
export default function Page() {
      const [products, setProducts] = useState<showProduto[]>([]);
       const [isCartOpen, setIsCartOpen] = useState(false);
       const { token } = useToken();
      
         
     useEffect(() => {
            if(!token) return;
    
            produtoFetch(token)
            .then(data => setProducts(data))
            .catch(err => console.error(err))
        })
       
        
    const [quantidades, setQuantidades] = useState<{ [key: number]: number }>(
        products.reduce((acc, produto) => ({ ...acc, [produto.id]: 0 }), {})
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
   

    const handleQuantidadeChange = (id: number, delta: number) => {
        setQuantidades(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta)
        }));
    };

    const handleCardClick = (id: number) => {
        setQuantidades(prev => {
            const isSelected = selectedProducts.includes(id);

            if (isSelected) {
                setSelectedProducts(prevSelected => prevSelected.filter(itemId => itemId !== id));
                return { ...prev, [id]: 0 };
            } else {
                setSelectedProducts(prevSelected => [...prevSelected, id]);
                return { ...prev, [id]: 1 };
            }
        });
    };
    
    const totalPrice = products.reduce((acc, produto) => {
    const quantidade = quantidades[produto.id] || 0;
    return acc + (produto.preco * quantidade);
}, 0);

  const cartItems = products.filter(produto => quantidades[produto.id] > 0);

const productsToDisplay = searchTerm === ''
        ? products
        : products.filter(produto =>
            produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const handleClearCart = () => {
  // recria o objeto com todos os valores = 0
  setQuantidades(products.reduce((acc, produto) => ({ ...acc, [produto.id]: 0 }), {}));
  setSelectedProducts([]); // esvazia os selecionados também
};

    return (
        <div className='p-6'>
            <div className='m-4'>
             <div className='flex flex-col md:flex-row justify-between gap-4 items-center md:items-end'>
    {/* Bloco de "Vendas" e "Total" */}
    <div>
        <h3 className='text-3xl font-bold'>Vendas</h3>
        <div className='text-2xl font-semibold'>Total:
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
        </div>
    </div>

    {/* Bloco de "Registro" e "Busca" */}
    <div className='flex flex-col md:flex-row gap-4 items-center'>
        <CartSheet 
            selectedProducts={cartItems} 
            quantities={quantidades} 
            totalPrice={totalPrice} 
            onClearCart={handleClearCart}
  onClose={() => setIsCartOpen(false)}
  isOpen={isCartOpen}
  setIsOpen={setIsCartOpen}
        />
        <Input type="search" placeholder="Buscar produto..." className="max-w-sm" 
         value={searchTerm} 
    onChange={(e) => setSearchTerm(e.target.value)} 
        />
    </div>
</div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {productsToDisplay.map((produto) => {
                    const isSelected = selectedProducts.includes(produto.id);

                    return (
                        <Card key={produto.id}
                            className={clsx("w-full transition-colors duration-200 cursor-pointer", {
                                "bg-stone-300": isSelected,
                                "hover:bg-gray-100": !isSelected,
                            })}
                            onClick={() => handleCardClick(produto.id)}
                        >
                            <CardHeader className="p-0">
                                <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                                    <Image
                                        src={produto.imagemUrl || '/images/placeholder.png'}
                                        alt={produto.nome}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-lg"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4 px-4">
                                <CardTitle className="text-xl font-semibold">{produto.nome}</CardTitle>
                              
                            </CardContent>
                            <CardFooter className="flex justify-between items-center p-4">
                                <span className="text-xl font-bold">
                                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            quantidades[produto.id] > 0 ? produto.preco * quantidades[produto.id] : produto.preco
        )}
                                </span>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-amber-500 cursor-pointer text-white hover:bg-amber-600"
                                        onClick={(e) => { e.stopPropagation(); handleQuantidadeChange(produto.id, -1); }}
                                    >
                                        -
                                    </Button>
                                    <span className="w-8 text-center font-medium">
                                        {quantidades[produto.id] || 0}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
                                        onClick={(e) => { e.stopPropagation(); handleQuantidadeChange(produto.id, 1); }}
                                    >
                                        +
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
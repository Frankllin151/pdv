"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent,  CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { produtos as produtosData , produtoFetch, deleteProduto } from '@/data/produto';
import Image from "next/image";
import { DeleteProductDialog } from '@/components/delete-product-dialog';
import { EditProductDialog } from '@/components/edit-product-dialog';
import { AddProductDialog } from '@/components/add-product-dialog';
import { showProduto, Produto} from '@/type/produto';
import { useToken } from '@/hooks/useToken';
export default function Page() {
    const [products, setProducts] = useState<showProduto[]>([]);
    
     const { token } = useToken();

  


    
    const handleDeleteProduct = (id: number) => {
        if (!token) return;
        setProducts(products.filter(p => p.id !== id));
        
       deleteProduto(id,token)
        
    };

    const handleEditProduct = (id: number, updatedProduct: { nome: string; preco: number }) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, ...updatedProduct } : p
        ));
    };

    const handleAddProduct = (newProductData: Omit<Produto, 'id'>) => {
        const newProduct = {
            id: Date.now(), // Gera um ID único
            ...newProductData,
        };
       // setProducts([newProduct, ...products]); // Adiciona o novo produto ao início da lista
    };
  
    useEffect(() => {
  if (!token) return; // só roda quando token existe

  const interval = setInterval(() => {
    produtoFetch(token)
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, 100); // 2000ms = 2 segundos

  // Limpeza do intervalo quando componente desmonta ou token muda
  return () => clearInterval(interval);
}, [token]);
  
    return (
        <div className="p-6">
            <div className="m-4">
               
                <div className='flex flex-col md:flex-row  justify-between gap-4 items-center md:items-end'>
 <div><h3 className='text-3xl font-bold'>Produto</h3>
                    <div className='text-2xl font-semibold'>Total de produtos: {products.length}</div>
                </div>
                <div>
                     <AddProductDialog onAddProduct={handleAddProduct} />
                </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((produto) => (
                    <Card key={produto.id} className="w-full">
                        <CardHeader className="p-0">
                            <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                                {produto.imagemUrl && (
                               <Image
                                src={produto.imagemUrl}
                                alt={produto.nome}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-t-lg"/>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 px-4">
                            <CardTitle className="text-xl font-semibold">{produto.nome}</CardTitle>
                           
                        </CardContent>
                        <CardFooter className="flex justify-between items-center p-4">
                            <span className="text-xl font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                            </span>
                            <div className="flex items-center space-x-2">
                                <EditProductDialog
                                    product={produto}
                                    onConfirmEdit={handleEditProduct}
                                />
                                <DeleteProductDialog
                                    product={produto}
                                    onConfirmDelete={handleDeleteProduct}
                                />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
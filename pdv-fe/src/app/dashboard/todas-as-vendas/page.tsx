"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

import { vendasFetch} from "@/data/vendas";
import { Vendas } from "@/type/vendas";
import { DeleteSaleDialog } from '@/components/delete-sale-dialog';
import { Button } from '@/components/ui/button';
import { useToken } from '@/hooks/useToken';
export default function Page() {
    const [sales, setSales] = useState<Vendas[]>([]);
   const { token } = useToken();
   
useEffect(() => {
        if(!token) return;

        vendasFetch(token)
        .then(data => setSales(data))
        .catch(err => console.error(err))
    })

   

    const handleDeleteSale = (id: number) => {
        setSales(prevSales => prevSales.filter(sale => sale.id !== id));
    };

    

    return (
        <div className="p-6">
            <div className='flex flex-col md:flex-row justify-between gap-4 items-center md:items-end mb-6'>
                <div>
                    <h3 className='text-3xl font-bold'>Histórico de Vendas</h3>
                <div className='text-2xl font-semibold'>
  Total de vendas de hoje:  
  {
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(
      sales
        .filter(sale => {
          const saleDate = new Date(sale.date);
          const now = new Date();
          return (
            saleDate.getDate() === now.getDate() &&
            saleDate.getMonth() === now.getMonth() &&
            saleDate.getFullYear() === now.getFullYear()
          );
        })
        .reduce((acc, sale) => acc + sale.totalprice, 0)
    )
  }
</div>
                </div>
                <div>
                    <Button className='bg-blue-500 hover:bg-blue-600 cursor-pointer'><a href="/dashboard/vendas">Add</a></Button>
                </div>
             
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sales.map((sale) => (
                    <Card key={sale.id} className="w-full">
                        <CardHeader className="p-4">
                            <CardTitle className="text-xl font-semibold">
                                Venda #{sale.id}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4">
                            <p className="text-sm text-gray-600">
                                Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalprice)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Data: {sale.date.toLocaleString('pt-BR')}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Itens: {Object.values(sale.quantities).reduce((total, q) => total + q, 0)}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center p-4">
                            <div className="flex items-center space-x-2">
                              
                                <DeleteSaleDialog sale={sale} onConfirmDelete={handleDeleteSale} />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
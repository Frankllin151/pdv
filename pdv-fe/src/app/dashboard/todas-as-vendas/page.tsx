"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

import { vendasFetch} from "@/data/vendas";
import { Vendas } from "@/type/vendas";
import { DeleteSaleDialog } from '@/components/delete-sale-dialog';
import { Button } from '@/components/ui/button';
import { useToken } from '@/hooks/useToken';

import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

export default function Page() {
   const [sales, setSales] = useState<Vendas[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
   const { token } = useToken();
   const LIMIT = 50;
   
   useEffect(() => {
        if(!token) return;
        let mounted = true;
        setLoading(true);

        vendasFetch(token, page, LIMIT)
        .then(data => {
            if (!mounted) return;
            // espera um array de vendas; normaliza datas
            if (Array.isArray(data)) {
              const normalized = data.map((s: any) => ({
                ...s,
                date: s.date ? new Date(s.date) : new Date(),
              }));
              setSales(normalized);
            } else {
              // caso a API retorne objeto não esperado, tenta usar data campo
              const arr = Array.isArray((data as any).data) ? (data as any).data : [];
              const normalized = arr.map((s: any) => ({ ...s, date: s.date ? new Date(s.date) : new Date() }));
              setSales(normalized);
            }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));

        return () => { mounted = false; }
    }, [token, page]);

    const handleDeleteSale = (id: number) => {
        setSales(prevSales => prevSales.filter(sale => sale.id !== id));
    };

    const canGoNext = sales.length === LIMIT; // se veio full page, possivelmente existe próxima
    const canGoPrev = page > 1;

    

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

            {loading ? <div>Carregando...</div> : (
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
                                Data: {new Date(sale.date).toLocaleString('pt-BR')}
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
            )}

            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious onClick={() => canGoPrev && setPage(p => p - 1)} aria-disabled={!canGoPrev} />
                  <li>
                    <PaginationLink className="cursor-default" isActive>
                      Página {page}
                    </PaginationLink>
                  </li>
                  <PaginationNext onClick={() => canGoNext && setPage(p => p + 1)} aria-disabled={!canGoNext} />
                </PaginationContent>
              </Pagination>
            </div>
        </div>
    );
}
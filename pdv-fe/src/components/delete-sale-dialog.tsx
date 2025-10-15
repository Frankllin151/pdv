"use client";

import { useState, useEffect, use } from 'react';
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
import { Vendas } from '@/type/vendas';
import { deleteVenda } from '@/data/vendas';
import { useToken } from '@/hooks/useToken';
interface DeleteSaleDialogProps {
    sale: Vendas;
    onConfirmDelete: (id: number) => void;
}

export function DeleteSaleDialog({ sale, onConfirmDelete }: DeleteSaleDialogProps) {
    const [open, setOpen] = useState(false);
     const {token} = useToken();
       
   
    const handleDelete = async () => {
        onConfirmDelete(sale.id!);
       if(!token) return;
        await deleteVenda(sale.id!, token);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="
                cursor-pointer
                bg-red-500 hover:bg-red-600 text-white">Excluir</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza de que deseja excluir a venda de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalprice)}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button className="cursor-pointer" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
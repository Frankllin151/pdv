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
import { Gasto } from '@/type/gasto';
import { deleteGasto } from '@/data/gasto';
import { useToken } from '@/hooks/useToken';
interface DeleteGastoDialogProps {
    gasto: Gasto;
    onConfirmDelete: (date: number) => void;
}

export function DeleteGastoDialog({ gasto }: DeleteGastoDialogProps) {
    const [open, setOpen] = useState(false);
 const {token} = useToken();
 
   const handleDelete = async () => {
  try {
    
     if(!token) return; 
    await deleteGasto(gasto.id, token);

    console.log(`Gasto ${gasto.id} deletado com sucesso`);
    // aqui você pode atualizar a lista sem precisar recarregar a página:
    // setGastos(prev => prev.filter(g => g.id !== gasto.id));

    setOpen(false);
  } catch (error) {
    console.error(error);
  }
};

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-red-500 hover:bg-red-600 text-white">Excluir</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza de que deseja excluir o gasto <strong>{gasto.nome}</strong> de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gasto.valor)}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Gasto } from '@/type/gasto';
import { addGasto } from '@/data/gasto';
import { NumericFormat } from 'react-number-format';
import { useToken } from '@/hooks/useToken';

interface AddGastoDialogProps {
    onAddGasto: (newGasto: Gasto) => void;
}

export function AddGastoDialog({ onAddGasto }: AddGastoDialogProps) {
    const [open, setOpen] = useState(false);
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('0');
    const [tipoGasto, setTipoGasto] = useState<"fixo" | "nao-fixo" | null>(null);
    const {token } = useToken();
    
    const handleSave = async () => {
    const numericValue = parseFloat(valor);
    
    const newGasto: Gasto = {
        id: 3,
        nome: nome,
        valor: numericValue,
        fixo: tipoGasto === 'fixo' ? 'fixo' : null,
        date: new Date(),
    };
 
    try {
        

if (!token) {
  
  return;
}
         await addGasto(newGasto, token);
      
        
        setOpen(false);
        setNome('');
        setTipoGasto(null);
        setValor('0');
    } catch (error: unknown) {
       if (error instanceof Error) {
      console.error("Erro: ", error.message);
    } else {
      console.error("Erro desconhecido :", error);
    }
    }
};

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">Add</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar Novo Gasto</DialogTitle>
                    <DialogDescription>
                        Preencha os detalhes do novo gasto.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nome" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo" className="text-right">
                            Tipo
                        </Label>
                        <Select onValueChange={(value: "fixo" | "nao-fixo") => setTipoGasto(value)} value={tipoGasto ?? ''}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o tipo de gasto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixo">Fixo</SelectItem>
                            <SelectItem value="nao-fixo">Não Fixo</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="valor" className="text-right">
                            Valor
                        </Label>
                        <NumericFormat
                            id="valor"
                            value={valor}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            decimalScale={2}
                            fixedDecimalScale
                            allowNegative={false}
                            onValueChange={(values) => setValor(values.value || '0')}
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
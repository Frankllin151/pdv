"use client";

import { use, useState } from 'react';
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
import { Gasto } from '@/type/gasto';
import { useToken } from '@/hooks/useToken';
import { NumericFormat } from 'react-number-format';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateGasto } from '@/data/gasto';
interface EditGastoDialogProps {
    gasto: Gasto;
    onConfirmEdit: (date: Date, updatedGasto: Gasto) => void;
}

export function EditGastoDialog({ gasto, onConfirmEdit }: EditGastoDialogProps) {
    const [open, setOpen] = useState(false);
    const [nome, setNome] = useState(gasto.nome);
    const [valor, setValor] = useState(gasto.valor.toString());
    const [tipoGasto, setTipoGasto] = useState<"fixo" | "nao-fixo" | null>(null);
const {token} = useToken();
   const handleUpdate = async () => {
  const numericValue = parseFloat(valor);
   

  const updatedGasto = {
    nome,
    valor: numericValue,
    date: new Date(),
    fixo: tipoGasto,
  };

  try {
    if(!token) return;
    const gastoEditado = await updateGasto(gasto.id, updatedGasto, token);
    console.log("Gasto atualizado:", gastoEditado);
  } catch (error) {
    console.error(error);
  }

  setOpen(false);
};

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">Editar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Gasto</DialogTitle>
                    <DialogDescription>
                        Altere os detalhes do gasto e clique em salvar.
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
                        <Select
                          onValueChange={(value: "fixo" | "nao-fixo") =>
    setTipoGasto(value === "fixo" ? "fixo" : null)
  }
  value={
    tipoGasto !== undefined
      ? (tipoGasto === "fixo" ? "fixo" : "nao-fixo")
      : (gasto.fixo === "fixo" ? "fixo" : "nao-fixo")
  }
                        >
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
                    <Button onClick={handleUpdate}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
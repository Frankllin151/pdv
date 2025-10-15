"use client";

import { useState , useEffect} from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { gastos as gastosData , gastosFetch } from "@/data/gasto";
import { Gasto } from "@/type/gasto";
import { AddGastoDialog } from "@/components/add-gasto-dialog";
import { EditGastoDialog } from "@/components/edit-gasto-dialog";
import { DeleteGastoDialog } from "@/components/delete-gasto-dialog";
import { useToken } from '@/hooks/useToken';
export default function Page() {
    const [gastos, setGastos] = useState<Gasto[]>([]);
     const { token } = useToken();

     useEffect(() => {
            if(!token) return;
    
            gastosFetch(token)
            .then(data => setGastos(data))
            .catch(err => console.error(err))
        })

    const handleAddGasto = (newGasto: Gasto) => {
        setGastos(prevGastos => [newGasto, ...prevGastos]);
    };

    const handleEditGasto = (date: Date, updatedGasto: Gasto) => {
        setGastos(prevGastos => prevGastos.map(gasto =>
            gasto.date.getTime() === date.getTime() ? updatedGasto : gasto
        ));
    };

    const handleDeleteGasto = (date: number) => {
        setGastos(prevGastos => prevGastos.filter(gasto => gasto.id === gasto.id));
    };

    // Calcula o total de gastos
const totalGastos = gastos.reduce((acc, gasto) => acc + Number(gasto.valor), 0);


    // Ordena os gastos pela data mais recente
    const sortedGastos = [...gastos].sort((a, b) => {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  return dateB - dateA;
});

    return (
        <div className="p-6">
            <div className='flex flex-col md:flex-row justify-between gap-4 items-center md:items-end mb-6'>
                <div>
                    <h3 className='text-3xl font-bold'>Gerenciamento de Gastos</h3>
                    <div className='text-2xl font-semibold'>
                        Total de Gastos: {
                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGastos)
                        }
                    </div>
                </div>
                <AddGastoDialog onAddGasto={handleAddGasto} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedGastos.map((gasto) => (
                    <Card key={new Date(gasto.date).getTime()} className="w-full">
                        <CardHeader className="p-4">
                            <CardTitle className="text-xl font-semibold">{gasto.nome}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4">
                            <p className="text-sm text-gray-600">
                                Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gasto.valor)}
                            </p>
                            <p className='text-sm text-gray-600'>
                            Tipo: {gasto.fixo === null ? "Não fixo" : "Fixo"}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Data: {new Date(gasto.date).toLocaleString("pt-BR", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit"
                                           })}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center p-4">
                            <div className="flex items-center space-x-2">
                                <EditGastoDialog gasto={gasto} onConfirmEdit={handleEditGasto} />
                                <DeleteGastoDialog gasto={gasto} onConfirmDelete={handleDeleteGasto} />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
"use client";

import { useState, useEffect } from 'react';
import { vendas as vendasData , TodasvendasFetch} from '@/data/vendas';
import { gastos as gastosData , gastosFetch} from '@/data/gasto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardChart } from '@/components/dashboard-chart';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'; // Instale @tabler/icons-react para os ícones
import { useToken } from '@/hooks/useToken';
export default function Page() {
 
const [vendas, setVendas] = useState(vendasData);


  const [gastos, setGastos] = useState(gastosData);
     const {token } = useToken();

      useEffect(() => {
             if(!token) return;
     
             gastosFetch(token)
             .then(data => setGastos(data))
             .catch(err => console.error(err))
         })
    
      useEffect(() => {
             if(!token) return;
     
             TodasvendasFetch(token)
             .then(data => setVendas(data))
             .catch(err => console.error(err))
         })

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const vendasMesAtual = vendas.filter(venda => {
    const vendaDate = new Date(venda.date);
    return vendaDate.getMonth() === currentMonth && vendaDate.getFullYear() === currentYear;
  });

  // Filtra gastos fixos para o cálculo total do mês atual
  // Apenas considera gastos fixos com data no ou antes do mês atual
  const gastosFixosMesAtual = gastos.filter(gasto => {
    const gastoDate = new Date(gasto.date);
    return gasto.fixo === 'fixo' && gastoDate.getFullYear() === currentYear && gastoDate.getMonth() <= currentMonth;
  });

  const gastosNaoFixosMesAtual = gastos.filter(gasto => {
    const gastoDate = new Date(gasto.date);
    return gasto.fixo === null && gastoDate.getMonth() === currentMonth && gastoDate.getFullYear() === currentYear;
  });

  const totalVendas = vendasMesAtual.reduce((acc, venda) => acc + Number(venda.totalprice), 0);

  const totalGastosFixos = gastosFixosMesAtual.reduce((acc, gasto) => acc + Number(gasto.valor), 0);
  const totalGastosNaoFixos = gastosNaoFixosMesAtual.reduce((acc, gasto) => acc + Number(gasto.valor) , 0);
  const totalGastos = totalGastosFixos + totalGastosNaoFixos;

  const lucro = totalVendas - totalGastos;
  const isLucro = lucro > 0;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {/* Card de Vendas */}
        <Card className="aspect-video">
          <CardHeader>
            <CardDescription>Total de Vendas</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalVendas)}
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Badge variant="outline">
                <IconTrendingUp className="size-4" />
                Vendas
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Card de Gastos */}
        <Card className="aspect-video">
          <CardHeader>
            <CardDescription>Total de Gastos</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGastos)}
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Badge variant="outline">
                <IconTrendingDown className="size-4" />
                Gastos
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Card de Lucro */}
        <Card className="aspect-video">
          <CardHeader>
            <CardDescription>Lucro</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.max(0, lucro))}
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Badge variant={isLucro ? 'default' : 'destructive'}>
                {isLucro ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                {isLucro ? 'Lucro' : 'Prejuízo'}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </div>

    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
        <DashboardChart />
      </div>
    </div>
  );
}
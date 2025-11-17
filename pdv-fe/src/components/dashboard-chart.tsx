"use client";

import { useState, useEffect, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import { Gasto } from "@/type/gasto";
import { Vendas } from "@/type/vendas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vendas as vendasData, TodasvendasFetch } from "@/data/vendas";
import { gastos as gastosData, gastosFetch } from "@/data/gasto";
import { useToken } from "@/hooks/useToken";

// Ano anterior dinamicamente
const lastYear = new Date().getFullYear() - 1;

// Dados de exemplo para o ano anterior
const mockVendasLastYear = [
  { totalprice: 150, date: new Date(`${lastYear}-01-10T10:00:00`) },
  { totalprice: 250, date: new Date(`${lastYear}-02-15T12:00:00`) },
  { totalprice: 350, date: new Date(`${lastYear}-03-20T14:00:00`) },
];

const mockGastosLastYear = [
  { valor: 80, fixo: null, date: new Date(`${lastYear}-01-05T09:00:00`) },
  { valor: 120, fixo: 'fixo', date: new Date(`${lastYear}-02-10T11:00:00`) },
  { valor: 180, fixo: null, date: new Date(`${lastYear}-03-25T13:00:00`) },
];

// Combina os dados de vendas e gastos
const allVendas = [...vendasData, ...mockVendasLastYear];
const allGastos = [...gastosData, ...mockGastosLastYear];

const months = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];
;

const chartConfig = {
  vendas: {
    label: "Vendas",
    color: "hsl(221.2, 83.2%, 53.3%)", // Cor para Vendas
  },
  gastos: {
    label: "Gastos",
    color: "hsl(240, 5.2%, 33.9%)", // Cor para Gastos
  },
  lucro: {
    label: "Lucro",
    color: "hsl(160.1, 84.1%, 39.4%)", // Cor para Lucro
  },
} satisfies ChartConfig;

export function DashboardChart() {
  
     const [year, setYear] = useState(new Date().getFullYear().toString());
  const [vendas, setVendas] = useState<Vendas[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useToken(); 
  useEffect(() => {
    if (!token) return;

    Promise.all([TodasvendasFetch(token), gastosFetch(token)])
      .then(([vendasData, gastosData]) => {
        setVendas(vendasData);
        setGastos(gastosData);
      })
      .catch(err => console.error("Erro ao carregar dados:", err))
      .finally(() => setLoading(false));
  }, [token]);

  const processedData = useMemo(() => {
    const dataByMonth = new Array(12).fill(null).map((_, i) => ({
      month: months[i],
      vendas: 0,
      gastos: 0,
      lucro: 0,
    }));

    // Vendas
    vendas.forEach(venda => {
      const vendaDate = new Date(venda.date);
      if (vendaDate.getFullYear().toString() === year) {
        const monthIndex = vendaDate.getMonth();
        dataByMonth[monthIndex].vendas += Number(venda.totalprice);
      }
    });

    // Gastos não fixos
    const gastosNaoFixosPorMes = new Array(12).fill(0);
    gastos.forEach(gasto => {
      const gastoDate = new Date(gasto.date);
      if (gasto.fixo === null && gastoDate.getFullYear().toString() === year) {
        gastosNaoFixosPorMes[gastoDate.getMonth()] += Number(gasto.valor);
      }
    });

    // Gastos fixos acumulados
    const gastosFixosAcumulados = new Array(12).fill(0);
    gastos.filter(g => g.fixo === "fixo").forEach(gastoFixo => {
      const gastoDate = new Date(gastoFixo.date);
      if (gastoDate.getFullYear().toString() === year) {
        const startMonthIndex = gastoDate.getMonth();
        for (let i = startMonthIndex; i < 12; i++) {
          gastosFixosAcumulados[i] += Number(gastoFixo.valor);
        }
      }
    });

    // Calcular final
    dataByMonth.forEach((data, index) => {
      data.gastos = gastosNaoFixosPorMes[index] + gastosFixosAcumulados[index];
      data.lucro = Math.max(0, data.vendas - data.gastos);
    });

    return dataByMonth;
  }, [year, vendas, gastos]);

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    vendas.forEach(v => years.add(new Date(v.date).getFullYear().toString()));
    gastos.forEach(g => years.add(new Date(g.date).getFullYear().toString()));
    return Array.from(years).sort();
  }, [vendas, gastos]);

  const valueFormatter = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  if (loading) return <div>Carregando dados...</div>;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Análise Financeira Anual</CardTitle>
          <CardDescription>
            Resultados de vendas, gastos e lucro por mês.
          </CardDescription>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="h-[300px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={processedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="vendas"
              type="natural"
              fill="var(--color-vendas)"
              stroke="var(--color-vendas)"
              stackId="a"
            />
            <Area
              dataKey="gastos"
              type="natural"
              fill="var(--color-gastos)"
              stroke="var(--color-gastos)"
              stackId="a"
            />
            <Area
              dataKey="lucro"
              type="natural"
              fill="var(--color-lucro)"
              stroke="var(--color-lucro)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
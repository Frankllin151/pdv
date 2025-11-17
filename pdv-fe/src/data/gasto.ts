import { Gasto } from "@/type/gasto"; // Supondo que a tipagem 'Gasto' está em 'types/gasto'

export const gastos: Gasto[] = [
    {
      id: 1,
      nome: "Compra de Ingredientes",
      valor: 150.75, 
      fixo:  null,
      date: new Date("2025-09-20T09:00:00"),
    },
    {
      id: 2,
      nome: "Manutenção do Forno",
      valor: 50.00,
      fixo:  null,
      date: new Date("2025-09-21T10:00:00"),
    },
    {
      id: 3,
      nome: "Pagamento de Aluguel",
      valor: 800.00,
      fixo:  "fixo",
      date: new Date("2025-06-22T12:00:00"),
    },
    {
      id: 4,
      nome: "Conta de Luz",
      valor: 75.30,
      fixo:  "fixo",
      date: new Date("2025-09-22T15:00:00"),
    },
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Read
export async function gastosFetch(token:string) 
{

  
  const res = await fetch(API_URL+"/api/gastos", {
    headers:{
      "Authorization": "Bearer "+token , 
      "Content-Type": "application/json"
    }
  })
  if(!res.ok){
    throw new Error(`Erro ao buscar gastos: ${res.statusText}`);
  }
  return res.json();
}

// create 
export async function addGasto(gasto: Gasto, token: string): Promise<Gasto> {
  const formData = new FormData();
  formData.append("nome", gasto.nome);
  formData.append("valor", gasto.valor.toString());
  formData.append("fixo", gasto.fixo ?? "");
  formData.append("date", gasto.date.toISOString().replace("T", " ").substring(0, 19));

  const res = await fetch(API_URL+"/api/gasto/post", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      // NÃO colocar "Content-Type" aqui!
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error(errorData);
    throw new Error(`Erro ao adicionar gasto: ${res.statusText}`);
  }

  return res.json();
}

/// edita
export async function updateGasto(id: number, gasto: Omit<Gasto, "id">, token: string): Promise<Gasto> {
  const res = await fetch(`${API_URL}/api/gasto/put/${id}`, {
    method: "POST", // ou PATCH, depende da sua rota no Laravel
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gasto),
  });

  if (!res.ok) {
    throw new Error(`Erro ao atualizar gasto: ${res.statusText}`);
  }

  return res.json();
}

///delete 
export async function deleteGasto(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/gasto/delete/${id}`, {
    method: "POST", // seu backend espera POST
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Erro ao deletar gasto: ${res.statusText}`);
  }
}


import { Vendas } from "@/type/vendas";
import { produtos as produtosData } from "./produto";

// Exemplo de como você pode criar dados de vendas estáticos.
// Em uma aplicação real, estes dados seriam buscados de um banco de dados.
export const vendas: Vendas[] = [
  {
    id: 1,
    totalprice: 25.50,
    produtos: [produtosData[0], produtosData[2]], // Pão Francês e Bolo de Chocolate
    quantities: {
      1: 5,
      3: 1,
    },
    date: new Date("2025-01-20T10:00:00"),
  },
  {
    id: 2,
    totalprice: 12.00,
    produtos: [produtosData[1]], // Café
    quantities: {
      2: 2,
    },
    date: new Date("2025-09-20T11:30:00"),
  },
  {
    id: 3,
    totalprice: 45.00,
    produtos: [produtosData[4], produtosData[5]], // Torta de Limão e Muffin de Blueberry
    quantities: {
      5: 1,
      6: 3,
    },
    date: new Date("2025-09-21T14:00:00"),
  },
];


//SHOW
export async function vendasFetch(token: string, page = 1, limit = 50) 
{
  if (!API_URL) throw new Error("API_URL não configurada");

  const res = await fetch(`${API_URL}/api/vendas?page=${page}&limit=${limit}`, {
    headers:{
      "Authorization": "Bearer "+token , 
      "Content-Type": "application/json"
    }
  })
  if(!res.ok){
    throw new Error(`Erro ao buscar vendas: ${res.statusText}`);
  }

  const json = await res.json().catch(() => null);

  // Normaliza diferentes formatos de resposta:
  // - se API retorna array -> retorna array
  // - se API retorna { data: [...] } ou { items: [...] } -> retorna esse array
  // - caso contrário, retorna o json cru
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.items)) return json.items;
  return json;
}


/// todas as vendas : 

export async function TodasvendasFetch(token:string) 
{
  const res = await fetch(API_URL+"/api/vendas/todas", {
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


 const API_URL = process.env.NEXT_PUBLIC_API_URL;
// create 
export async function addVenda(venda: Vendas, token: string): Promise<Vendas> {
  const res = await fetch(API_URL+"/api/vendas/post", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(venda),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error(errorData);
    throw new Error(`Erro ao adicionar venda: ${res.statusText}`);
  }

  return res.json();
}



///delete 
export async function deleteVenda(id: number, token: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/venda/delete/${id}`, {
    method: "POST", // seu backend espera POST
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Erro ao deletar venda: ${res.statusText}`);
  }
}

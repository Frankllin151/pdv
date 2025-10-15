import { Produto } from "@/type/produto";

export const produtos: Produto[] = [
  {
    id: 1,
    nome: "Pão Francês",
    preco: 0.50,
    imagemUrl: "/images/pao-frances.jpg",
    quantidade: 200,
  },
  {
    id: 2,
    nome: "Pão de Queijo",
    preco: 6.00,
    imagemUrl: "/images/pao-de-queijo.jpg",
    quantidade: 120,
  },
  {
    id: 3,
    nome: "Bolo de Fubá",
    preco: 15.00,
    imagemUrl: "/images/bolo-fuba.jpg",
    quantidade: 8,
  },
  {
    id: 4,
    nome: "Bolo de Chocolate",
    preco: 25.00,
    imagemUrl: "/images/bolo-chocolate.jpg",
    quantidade: 6,
  },
  {
    id: 5,
    nome: "Coxinha de Frango",
    preco: 5.00,
    imagemUrl: "/images/coxinha.jpg",
    quantidade: 50,
  },
  {
    id: 6,
    nome: "Esfirra de Carne",
    preco: 4.50,
    imagemUrl: "/images/esfirra-carne.jpg",
    quantidade: 40,
  },
  {
    id: 7,
    nome: "Croissant",
    preco: 6.00,
    imagemUrl: "/images/croissant.jpg",
    quantidade: 30,
  },
  {
    id: 8,
    nome: "Sonho com Creme",
    preco: 7.00,
    imagemUrl: "/images/sonho.jpg",
    quantidade: 25,
  },
  {
    id: 9,
    nome: "Pastel de Queijo",
    preco: 6.50,
    imagemUrl: "/images/pastel-queijo.jpg",
    quantidade: 35,
  },
  {
    id: 10,
    nome: "Quiche de Alho Poró",
    preco: 18.00,
    imagemUrl: "/images/quiche-alho-poro.jpg",
    quantidade: 10,
  },
  {
    id: 11,
    nome: "Empada de Frango",
    preco: 5.50,
    imagemUrl: "/images/empada-frango.jpg",
    quantidade: 40,
  },
  {
    id: 12,
    nome: "Baguete",
    preco: 4.00,
    imagemUrl: "/images/baguete.jpg",
    quantidade: 30,
  },
  {
    id: 13,
    nome: "Pão Integral",
    preco: 8.00,
    imagemUrl: "/images/pao-integral.jpg",
    quantidade: 20,
  },
  {
    id: 14,
    nome: "Torta de Limão",
    preco: 30.00,
    imagemUrl: "/images/torta-limao.jpg",
    quantidade: 5,
  },
  {
    id: 15,
    nome: "Torta de Frango",
    preco: 35.00,
    imagemUrl: "/images/torta-frango.jpg",
    quantidade: 6,
  },
  {
    id: 16,
    nome: "Biscoito de Polvilho",
    preco: 3.50,
    imagemUrl: "/images/biscoito-polvilho.jpg",
    quantidade: 50,
  },
  {
    id: 17,
    nome: "Enroladinho de Salsicha",
    preco: 4.50,
    imagemUrl: "/images/enroladinho-salsicha.jpg",
    quantidade: 40,
  },
  {
    id: 18,
    nome: "Palmier",
    preco: 5.00,
    imagemUrl: "/images/palmier.jpg",
    quantidade: 20,
  },
  {
    id: 19,
    nome: "Rosquinha Açucarada",
    preco: 2.50,
    imagemUrl: "/images/rosquinha.jpg",
    quantidade: 60,
  },
  {
    id: 20,
    nome: "Pão Doce com Coco",
    preco: 7.00,
    imagemUrl: "/images/pao-doce-coco.jpg",
    quantidade: 15,
  },
];

 const API_URL = process.env.NEXT_PUBLIC_API_URL;

 
// show 
export async function produtoFetch(token:string) 
{
  const res = await fetch(API_URL+"/api/produtos", {
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


// adicionar 
export async function addProduto(produto: Omit<Produto, "id">, token:string): Promise<Produto> {
  const formData = new FormData();

  formData.append("nome", produto.nome);
  formData.append("preco", produto.preco.toString());
  formData.append("quantidade", produto.quantidade?.toString() || "0");

  if (produto.imagemUrl instanceof File) {
    formData.append("imagem", produto.imagemUrl);
  }

  const res = await fetch(API_URL+"/api/produto/post", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Sanctum token
      // ❌ Não usar Content-Type aqui, o navegador define automaticamente como multipart/form-data
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Erro ao adicionar produto: ${res.statusText}`);
  }

  return res.json();
}

// edita


// Editar produto (update)
export async function updateProduto(id: number, dados: { nome: string; preco: number }, token: string): Promise<Produto> {
  const formData = new FormData();
  formData.append("nome", dados.nome);
  formData.append("preco", dados.preco.toString());

  const res = await fetch(`${API_URL}/api/produto/${id}/put`, {
    method: "POST", // se no backend usar PUT ou PATCH, ajuste aqui
    headers: {
      Authorization: `Bearer ${token}`, // token do usuário
      // ❌ Não colocar Content-Type, o FormData define automaticamente
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Erro ao atualizar produto: ${res.statusText}`);
  }

  return res.json();
}


/// delete 
export async function deleteProduto(id: number, token: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/produto/${id}/delete`, {
    method: "POST", // usamos POST conforme a rota
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ Não precisa de Content-Type, pois não enviamos body
    },
  });

  if (!res.ok) {
    throw new Error(`Erro ao deletar produto: ${res.statusText}`);
  }

  return res.json();
}
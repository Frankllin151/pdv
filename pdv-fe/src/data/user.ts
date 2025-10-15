import { User } from "../type/user";


 const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, senha: string): Promise<User> {
  const response = await fetch(API_URL+"/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password: senha }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao fazer login");
  }

  const data: User = await response.json();
  return data;
}
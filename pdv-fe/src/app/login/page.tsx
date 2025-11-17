"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/data/user";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToken } from "@/hooks/useToken";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 const router = useRouter();
 const { token } = useToken();

if(token){
  router.push("/dashboard");
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const user = await login(email, password);
   

    // Exemplo: salvar token no localStorage
    localStorage.setItem("token", user.token);
router.push("/dashboard");
  ///  localStorage.setItem("user", JSON.stringify({ id: user.id, email: user.email, name: user.name, token: user.token }));
    // Redirecionar ou atualizar estado
    
   
    
    // router.push("/dashboard"); // se estiver usando next/router
  } catch (error: unknown) {
     if (error instanceof Error) {
      console.error("Erro no login:", error.message);
    } else {
      console.error("Erro desconhecido no login:", error);
    }
  }
};

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-md border">
        <h1 className="text-2xl font-bold text-center mb-6">Entrar</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
          >
            Entrar
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Esqueci minha senha?
          </Link>
        </div>
      </div>
    </div>
  );
}

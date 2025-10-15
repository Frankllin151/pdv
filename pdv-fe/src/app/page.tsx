"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function Home() {
   const router = useRouter();
   router.push("/dashboard.html");
  return (
    <div className="mt-2 flex justify-center">
      <Button
      
      >Click me</Button>
    </div>
  )
}
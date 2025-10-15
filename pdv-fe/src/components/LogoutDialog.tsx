"use client"

import { LogOut } from "lucide-react"
import { useToken } from "@/hooks/useToken"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useState } from "react"

export function LogoutDialog() {
  const { destroyToken } = useToken()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    destroyToken()
    router.push("/login.html")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
    
          
         
        <div className="cursor-pointer">Sair</div>
        
      
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deseja realmente sair?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleLogout}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GeraQrCode(preco: number, token: string) {
  try {
    const response = await fetch(`${API_URL}/api/gera/qrcode/pix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ preco })
    });

    if (!response.ok) {
      throw new Error(`Erro ao gerar QR Code: ${response.status}`);
    }

    const data = await response.json();
    return data; 
    // Aqui normalmente vem algo como: 
    // data.qr_code, data.qr_code_base64, data.id_pagamento...
  } 
  catch (error) {
    console.error("Erro na API:", error);
    return null;
  }
}

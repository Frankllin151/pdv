import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pdvback.techgroweb.shop",
        pathname: "/image/**", // todas as imagens dentro de /image/
      },
    ],
     unoptimized: true,
  },
  output: "export", // Configura o Next.js para exportação estática
  basePath: "", // Use se o app estiver em um subdiretório
  assetPrefix: "", // Use se os assets estiverem em um CDN ou subdiretório
   
};

export default nextConfig;

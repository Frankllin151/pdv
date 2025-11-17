import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
   images: {
    remotePatterns: [
      {
        protocol: "https",
        // produção: pdvback.techgroweb.shop 
        hostname: "localhost",
        pathname: "/image/**", // todas as imagens dentro de /image/
      },
    ],
     unoptimized: true,
  },
 
   
};

export default nextConfig;

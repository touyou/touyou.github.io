import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Toreta のアプリは古い URL を開くので、全アプリの表記の Toreta の節へ送る
  async redirects() {
    return [{ source: "/toreta/legal", destination: "/legal#toreta", permanent: true }];
  },
};

export default nextConfig;

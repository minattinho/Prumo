import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/contratante",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

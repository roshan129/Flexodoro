import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "flexodoro.com",
          },
        ],
        destination: "https://www.flexodoro.com/:path*",
        permanent: true,
      },
      {
        source: "/landing",
        destination: "/",
        permanent: true,
      },
      {
        source: "/app",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

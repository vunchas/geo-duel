import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client", "@neondatabase/serverless"],
};

export default nextConfig;

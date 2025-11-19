import type { NextConfig } from "next";

console.log("Next Config - OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);

const nextConfig: NextConfig = {
  env: {
    HAS_OPENAI_KEY: process.env.OPENAI_API_KEY ? 'true' : 'false',
  },
};

export default nextConfig;

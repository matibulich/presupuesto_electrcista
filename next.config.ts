import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  outputFileTracingIncludes: {
    "/api/ordenes/[id]/pdf": [
      "./node_modules/pdfkit/js/standard-fonts/**/*",
    ],
  },
};

export default withPWA({
  dest: "public",
  register: true,
})(nextConfig);
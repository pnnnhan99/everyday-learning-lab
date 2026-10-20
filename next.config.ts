import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pnnnhan99/ai",
    "@pnnnhan99/auth",
    "@pnnnhan99/common",
    "@pnnnhan99/config",
    "@pnnnhan99/core",
    "@pnnnhan99/database",
    "@pnnnhan99/firebase",
    "@pnnnhan99/i18n",
    "@pnnnhan99/logger",
    "@pnnnhan99/motion",
    "@pnnnhan99/social-core",
    "@pnnnhan99/social-providers",
    "@pnnnhan99/storage",
    "@pnnnhan99/supabase",
    "@pnnnhan99/tailwind-config",
    "@pnnnhan99/theme",
    "@pnnnhan99/tts",
    "@pnnnhan99/types",
    "@pnnnhan99/ui",
    "@pnnnhan99/utils",
  ],
  turbopack: {
    resolveAlias: {
      "./cn.js": "./external-packages/nhan-packages/packages/utils/src/cn.ts",
      "./format.js": "./external-packages/nhan-packages/packages/utils/src/format.ts",
      "./health.js": "./external-packages/nhan-packages/packages/utils/src/health.ts",
      "./mock-data.js": "./external-packages/nhan-packages/packages/utils/src/mock-data.ts",
    },
  },
};

export default nextConfig;

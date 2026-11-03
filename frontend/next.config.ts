import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // pin the workspace root so Turbopack does not walk up past this package
  // (avoids the "inferred workspace root" warning in multi-package checkouts)
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

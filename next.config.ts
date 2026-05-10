import type { NextConfig } from "next";
import path from "path";

/**
 * Pin tracing root to this app when another lockfile exists higher in the tree
 * (avoids wrong workspace detection + odd peer resolution for optional deps).
 */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;

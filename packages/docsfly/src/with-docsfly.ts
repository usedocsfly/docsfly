import { NextConfig } from "next";

export function withDocsfly(nextConfig: NextConfig = {}): NextConfig {
  return {
    ...nextConfig,
    outputFileTracingIncludes: {
      "/*": ["./docs/**/*", "./blog/**/*"],
      "/docs/*": ["./docs/**/*"],
      "/blog/*": ["./blog/**/*"],
    },
    experimental: {
      ...nextConfig.experimental,
      // Output tracing for standalone mode
    },
    // Output standalone for better deployment compatibility
    output: "standalone",
  };
}
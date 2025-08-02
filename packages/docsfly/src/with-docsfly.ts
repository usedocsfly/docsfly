import { NextConfig } from "next";
import path from "path";

export function withDocsfly(
  nextConfig: NextConfig = {},
  projectDir?: string,
): NextConfig {
  const outputFileTracingRoot = projectDir
    ? { outputFileTracingRoot: path.join(projectDir, "../../") }
    : {
        outputFileTracingIncludes: {
          "/*": ["./docs/**/*", "./blog/**/*"],
        },
      };

  return {
    ...nextConfig,
    transpilePackages: ["docsfly"],
    output: "standalone",
    ...outputFileTracingRoot,
    experimental: {
      ...nextConfig.experimental,
    },
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  };
}

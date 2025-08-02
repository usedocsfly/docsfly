import { NextConfig } from "next";
import path from "path";

export function withDocsfly(
  nextConfig: NextConfig = {},
  options?: { projectDir?: string; isMonorepo?: boolean },
): NextConfig {
  const { projectDir, isMonorepo } = options ?? {};

  const tracingRoot = projectDir
    ? isMonorepo
      ? path.join(projectDir, "../../")
      : projectDir
    : undefined;

  return {
    ...nextConfig,
    transpilePackages: ["docsfly"],
    output: "standalone",
    outputFileTracingRoot: tracingRoot,
    outputFileTracingIncludes: {
      "/*": ["./docs/**/*", "./blog/**/*"],
    },
    experimental: {
      ...nextConfig.experimental,
    },
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  };
}

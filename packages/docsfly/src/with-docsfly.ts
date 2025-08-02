import { NextConfig } from "next";
import path from "path";

export function withDocsfly(
  nextConfig: NextConfig = {},
  options?: {
    projectDir?: string;
    isMonorepo?: boolean;
    output?: "none" | "standalone" | "export";
  },
): NextConfig {
  const { projectDir, isMonorepo, output = "standalone" } = options ?? {};

  const tracingRoot = projectDir
    ? isMonorepo
      ? path.join(projectDir, "../../")
      : projectDir
    : undefined;

  return {
    ...nextConfig,
    env: {
      ...nextConfig.env,
      DOCSFLY_IS_MONOREPO: String(!!isMonorepo),
    },
    transpilePackages: ["docsfly"],
    output: output !== "none" ? output : undefined,
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

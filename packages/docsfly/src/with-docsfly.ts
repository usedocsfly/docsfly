import { NextConfig } from "next";
import path from "path";

export function withDocsfly(
  nextConfig: NextConfig = {},
  options?: { projectDir?: string; isMonorepo?: boolean },
): NextConfig {
  let outputFileTracingOption = {};

  if (options?.projectDir) {
    const { projectDir, isMonorepo } = options;
    const tracingRoot = isMonorepo
      ? path.join(projectDir, "../../")
      : projectDir;
    outputFileTracingOption = { outputFileTracingRoot: tracingRoot };
  } else {
    outputFileTracingOption = {
      outputFileTracingIncludes: {
        "/*": ["./docs/**/*", "./blog/**/*"],
      },
    };
  }

  return {
    ...nextConfig,
    transpilePackages: ["docsfly"],
    output: "standalone",
    ...outputFileTracingOption,
    experimental: {
      ...nextConfig.experimental,
    },
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  };
}

import { NextConfig } from "next";
import { withDocsfly } from "docsfly";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default withDocsfly(nextConfig);

#!/usr/bin/env bun

async function buildPackage() {  
  // Build ESM version
  const esmResult = await Bun.build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    format: 'esm',
    splitting: true,
    sourcemap: 'inline'
  });

  console.log('Build completed successfully');
}

buildPackage().catch(console.error);
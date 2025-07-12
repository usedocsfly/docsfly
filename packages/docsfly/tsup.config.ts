import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/**/*.tsx',
    'src/**/*.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  bundle: false,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  outDir: 'dist',
})
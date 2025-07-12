import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/components/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.banner = {
      js: `
        if (typeof document !== 'undefined') {
          // Preserve use client directives
        }
      `
    }
  },
  async onSuccess() {
    // Post-process to preserve "use client" directives
    const fs = await import('fs')
    const path = await import('path')
    const glob = await import('glob')
    
    const files = glob.sync('dist/**/*.{js,mjs}')
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      if (content.includes('/* use client */') || file.includes('client-layout') || file.includes('theme-provider')) {
        const newContent = '"use client";\n' + content
        fs.writeFileSync(file, newContent)
      }
    }
  }
})
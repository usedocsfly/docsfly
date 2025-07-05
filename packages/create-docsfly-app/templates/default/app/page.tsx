import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { BookOpen, Zap, Palette, Code } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Docsfly
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            A modern documentation framework built with Next.js, MDX, and shadcn/ui
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/docs">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg">
              <a href="https://github.com/docsfly/docsfly" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600" />
              <CardTitle>MDX Support</CardTitle>
              <CardDescription>
                Write documentation with MDX, combining Markdown with React components
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-yellow-600" />
              <CardTitle>Fast Performance</CardTitle>
              <CardDescription>
                Built on Next.js 15 with App Router and Turbopack for lightning-fast builds
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Palette className="h-8 w-8 text-purple-600" />
              <CardTitle>Beautiful UI</CardTitle>
              <CardDescription>
                Styled with shadcn/ui components and Tailwind CSS for a modern look
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-green-600" />
              <CardTitle>Developer Friendly</CardTitle>
              <CardDescription>
                TypeScript support, file-based routing, and hot reloading out of the box
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
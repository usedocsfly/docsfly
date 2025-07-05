import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-semibold text-gray-900 dark:text-white mb-4">
          Welcome to Docsfly
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          A modern documentation framework built with Next.js and MDX.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/docs"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/docs/components"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View Components
          </Link>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            🚀 Features
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Next.js 15 with App Router</li>
            <li>• MDX support with React components</li>
            <li>• Tailwind CSS v4 for styling</li>
            <li>• Fully customizable theming</li>
            <li>• File-based routing for documentation</li>
            <li>• Built with TypeScript</li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            🎨 Built-in Components
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>• Callouts for important information</li>
            <li>• Syntax-highlighted code blocks</li>
            <li>• Interactive tabs for content organization</li>
            <li>• Inline code snippets</li>
            <li>• Dark/light theme toggle</li>
            <li>• Automatic navigation generation</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Why Choose Docsfly?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Docsfly combines the best of static site generation with the interactivity of React components. 
          Create beautiful, fast, and maintainable documentation with minimal setup.
        </p>
        <div className="flex gap-4">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Quick Start Guide →
          </Link>
          <Link
            href="/docs/theming"
            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            Customization Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
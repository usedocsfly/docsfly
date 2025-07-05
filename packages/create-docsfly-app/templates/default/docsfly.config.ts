import { DocsConfig } from 'docsfly'

const config: DocsConfig = {
  site: {
    title: 'My Docsfly App',
    description: 'A documentation website built with Docsfly',
    url: 'https://my-docsfly-app.vercel.app',
  },
  docs: {
    path: 'docs',
    defaultLayout: 'default',
  },
  theme: {
    primaryColor: 'blue',
    accentColor: 'purple',
  },
  navigation: {
    logo: {
      text: 'My Docs',
    },
    links: [
      {
        title: 'GitHub',
        href: 'https://github.com/docsfly/docsfly',
        external: true,
      },
    ],
  },
}

export default config
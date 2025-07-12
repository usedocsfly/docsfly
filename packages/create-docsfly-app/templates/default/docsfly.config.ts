import { DocsflyConfig } from 'docsfly'

const config: DocsflyConfig = {
  site: {
    name: 'My Docsfly App',
    description: 'A documentation website built with Docsfly',
    url: 'https://my-docsfly-app.vercel.app',
  },
  docs: {
    dir: 'docs',
  },
  navigation: {
    logo: {
      text: 'My Docsfly App',
    },
    links: [
      {
        text: 'GitHub',
        href: 'https://github.com/docsflyapp/docsfly',
        external: true,
      },
    ],
  },
}

export default config
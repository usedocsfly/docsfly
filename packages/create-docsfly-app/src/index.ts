import { program } from 'commander'
import { createApp } from './create-app.js'
import { version } from '../package.json'

program
  .name('create-docsfly-app')
  .description('Create a new Docsfly documentation app with shadcn/ui and Next.js App Router')
  .version(version)
  .argument('[project-directory]', 'Project directory name')
  .option('-t, --template <template>', 'Template to use', 'default')
  .option('--skip-install', 'Skip package installation')
  .option('--skip-git', 'Skip git initialization')
  .action(async (projectDirectory, options) => {
    await createApp(projectDirectory, options)
  })

program.parse()
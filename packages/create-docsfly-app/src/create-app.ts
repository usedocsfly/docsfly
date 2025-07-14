import path from "path";
import fs from "fs-extra";
import prompts from "prompts";
import chalk from "chalk";
import ora from "ora";
import { execSync } from "child_process";
import validateProjectName from "validate-npm-package-name";

function isGitRepository(): boolean {
  try {
    execSync("git rev-parse --git-dir", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

export interface CreateAppOptions {
  template: string;
  skipInstall?: boolean;
  skipGit?: boolean;
}

export async function createApp(
  projectDirectory?: string,
  options: CreateAppOptions = { template: "default" }
) {
  let projectName = projectDirectory;
  let projectPath: string;

  // Handle special case for current directory
  if (projectName === "./" || projectName === ".") {
    projectPath = process.cwd();
    projectName = path.basename(projectPath);
  } else {
    if (!projectName) {
      const response = await prompts({
        type: "text",
        name: "projectName",
        message: "What is your project named?",
        initial: "my-docsfly-app",
        validate: (name) => {
          if (name === "./" || name === ".") {
            return true;
          }
          const validation = validateProjectName(name);
          if (validation.validForNewPackages) {
            return true;
          }
          return "Invalid project name";
        },
      });

      if (!response.projectName) {
        console.log(chalk.red("✖ Project name is required"));
        process.exit(1);
      }

      projectName = response.projectName;
    }

    // Handle case where user inputs "./" or "." during prompt
    if (projectName === "./" || projectName === ".") {
      projectPath = process.cwd();
      projectName = path.basename(projectPath);
    } else {
      projectPath = path.resolve(projectName || ".");
    }
  }

  // Check if directory exists and is not empty (unless it's current directory)
  if (projectPath !== process.cwd() && fs.existsSync(projectPath)) {
    console.log(chalk.red(`✖ Directory ${projectName} already exists`));
    process.exit(1);
  }

  // If using current directory, check if it's empty
  if (projectPath === process.cwd()) {
    const files = fs.readdirSync(projectPath).filter(file => !file.startsWith('.'));
    if (files.length > 0) {
      console.log(chalk.red(`✖ Current directory is not empty`));
      process.exit(1);
    }
  }

  // Check if we should ask for installation and git options
  if (options.skipInstall === undefined || options.skipGit === undefined) {
    const setupResponse = await prompts([
      {
        type: options.skipInstall === undefined ? "confirm" : null,
        name: "shouldInstall",
        message: "Would you like to install dependencies?",
        initial: true,
      },
      {
        type: options.skipGit === undefined ? "confirm" : null,
        name: "shouldInitGit",
        message: "Would you like to initialize a git repository?",
        initial: !isGitRepository(),
      },
    ]);

    if (options.skipInstall === undefined) {
      options.skipInstall = !setupResponse.shouldInstall;
    }
    if (options.skipGit === undefined) {
      options.skipGit = !setupResponse.shouldInitGit;
    }
  }

  const packageManager = detectPackageManager();
  function detectPackageManager(): string {
    // Check which package manager is being used by looking at the process
    const userAgent = process.env.npm_config_user_agent;

    if (userAgent) {
      if (userAgent.includes("bun")) return "bun";
      if (userAgent.includes("pnpm")) return "pnpm";
      if (userAgent.includes("yarn")) return "yarn";
      if (userAgent.includes("npm")) return "npm";
    }

    // Fallback: check for lock files in current directory
    if (fs.existsSync("bun.lockb")) return "bun";
    if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
    if (fs.existsSync("yarn.lock")) return "yarn";
    if (fs.existsSync("package-lock.json")) return "npm";

    // No package manager detected
    throw new Error(
      "Could not detect package manager. Please run with npm, yarn, pnpm, or bun."
    );
  }

  const templatePath = path.resolve(
    __dirname,
    "..",
    "templates",
    options.template
  );

  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.log(chalk.red(`✖ Template "${options.template}" does not exist`));
    process.exit(1);
  }

  console.log(
    chalk.cyan(`Creating a new Docsfly app in ${chalk.green(projectPath)}`)
  );
  console.log();

  // Copy template
  const spinner = ora("Copying template files...").start();
  await fs.copy(templatePath, projectPath);
  spinner.succeed("Template files copied");

  // Update package.json with project name
  const packageJsonPath = path.join(projectPath, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = projectName;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  // Install dependencies
  if (!options.skipInstall) {
    const installSpinner = ora(
      `Installing dependencies with ${packageManager}...`
    ).start();
    try {
      execSync(`${packageManager} install`, {
        cwd: projectPath,
        stdio: ["ignore", "pipe", "pipe"],
      });
      installSpinner.succeed("Dependencies installed");
    } catch (error) {
      installSpinner.fail("Failed to install dependencies");
      console.log(
        chalk.yellow(`Please run "${packageManager} install" manually`)
      );
    }
  }

  // Initialize git
  if (!options.skipGit) {
    const gitSpinner = ora("Initializing git repository...").start();
    try {
      // Check if git is already initialized in the project directory
      const gitDir = path.join(projectPath, ".git");
      if (!fs.existsSync(gitDir)) {
        execSync("git init", { cwd: projectPath, stdio: "pipe" });
        execSync("git add .", { cwd: projectPath, stdio: "pipe" });
        execSync('git commit -m "Initial commit"', {
          cwd: projectPath,
          stdio: "pipe",
        });
        gitSpinner.succeed("Git repository initialized");
      } else {
        gitSpinner.succeed("Git repository already exists");
      }
    } catch (error) {
      gitSpinner.fail("Failed to initialize git");
      console.log(chalk.yellow("Please initialize git manually"));
    }
  }

  console.log();
  console.log(
    chalk.green("✓ Success! Created"),
    chalk.cyan(projectName),
    chalk.green("at"),
    chalk.cyan(projectPath)
  );
  console.log();
  console.log("Inside that directory, you can run several commands:");
  console.log();
  console.log(chalk.cyan(`  ${packageManager} run dev`));
  console.log("    Starts the development server");
  console.log();
  console.log(chalk.cyan(`  ${packageManager} run build`));
  console.log("    Builds the app for production");
  console.log();
  console.log(chalk.cyan(`  ${packageManager} run start`));
  console.log("    Runs the built app in production mode");
  console.log();
  console.log("We suggest that you begin by typing:");
  console.log();
  console.log(chalk.cyan("  cd"), projectName);
  console.log(chalk.cyan("  bun run dev"));
  console.log();
  console.log(chalk.green("Happy documenting! 📖"));
}

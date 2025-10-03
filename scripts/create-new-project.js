#!/usr/bin/env node

/**
 * Create New Project Script
 * Creates a new project from the Purely Development template
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getProjectInfo() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    log('Usage: node create-new-project.js <project-name> [project-description]', 'red');
    log('Example: node create-new-project.js my-awesome-app "A new web application"', 'yellow');
    process.exit(1);
  }
  
  const projectName = args[0];
  const projectDescription = args[1] || `A new web application built with Purely Development template`;
  
  // Validate project name
  if (!/^[a-z0-9-]+$/.test(projectName)) {
    log('❌ Project name must contain only lowercase letters, numbers, and hyphens', 'red');
    log('   Example: my-awesome-app', 'yellow');
    process.exit(1);
  }
  
  return { projectName, projectDescription };
}

function createProjectDirectory(projectName) {
  const projectPath = path.join(process.cwd(), '..', projectName);
  
  if (fs.existsSync(projectPath)) {
    log(`❌ Directory ${projectName} already exists`, 'red');
    log(`   Path: ${projectPath}`, 'red');
    process.exit(1);
  }
  
  try {
    fs.mkdirSync(projectPath, { recursive: true });
    log(`✅ Created project directory: ${projectPath}`, 'green');
    return projectPath;
  } catch (error) {
    log(`❌ Failed to create project directory: ${error.message}`, 'red');
    process.exit(1);
  }
}

function copyTemplateFiles(templatePath, projectPath) {
  log('\n📁 Copying template files...', 'blue');
  
  const filesToCopy = [
    'template',
    '.github',
    'docs',
    'package.json',
    'README.md',
    'LICENSE'
  ];
  
  for (const item of filesToCopy) {
    const sourcePath = path.join(templatePath, item);
    const destPath = path.join(projectPath, item);
    
    if (fs.existsSync(sourcePath)) {
      try {
        if (fs.statSync(sourcePath).isDirectory()) {
          execSync(`cp -r "${sourcePath}" "${destPath}"`, { stdio: 'pipe' });
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
        log(`  ✅ Copied ${item}`, 'green');
      } catch (error) {
        log(`  ❌ Failed to copy ${item}: ${error.message}`, 'red');
      }
    }
  }
}

function updateProjectFiles(projectPath, projectName, projectDescription) {
  log('\n🔧 Updating project files...', 'blue');
  
  // Update main package.json
  const packageJsonPath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.name = projectName;
      packageJson.description = projectDescription;
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      log('  ✅ Updated main package.json', 'green');
    } catch (error) {
      log(`  ❌ Failed to update main package.json: ${error.message}`, 'red');
    }
  }
  
  // Update template package.json
  const templatePackageJsonPath = path.join(projectPath, 'template', 'package.json');
  if (fs.existsSync(templatePackageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(templatePackageJsonPath, 'utf8'));
      packageJson.name = projectName;
      packageJson.description = projectDescription;
      fs.writeFileSync(templatePackageJsonPath, JSON.stringify(packageJson, null, 2));
      log('  ✅ Updated template package.json', 'green');
    } catch (error) {
      log(`  ❌ Failed to update template package.json: ${error.message}`, 'red');
    }
  }
  
  // Update README.md
  const readmePath = path.join(projectPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    try {
      let readme = fs.readFileSync(readmePath, 'utf8');
      readme = readme.replace(/purely-development-template/g, projectName);
      readme = readme.replace(/Purely Development - A comprehensive template for all new development projects/g, projectDescription);
      fs.writeFileSync(readmePath, readme);
      log('  ✅ Updated README.md', 'green');
    } catch (error) {
      log(`  ❌ Failed to update README.md: ${error.message}`, 'red');
    }
  }
  
  // Update template README.md
  const templateReadmePath = path.join(projectPath, 'template', 'README.md');
  if (fs.existsSync(templateReadmePath)) {
    try {
      let readme = fs.readFileSync(templateReadmePath, 'utf8');
      readme = readme.replace(/Purely Development App Template/g, `${projectName} - App Template`);
      readme = readme.replace(/A Next.js application built with the Purely Development template/g, projectDescription);
      fs.writeFileSync(templateReadmePath, readme);
      log('  ✅ Updated template README.md', 'green');
    } catch (error) {
      log(`  ❌ Failed to update template README.md: ${error.message}`, 'red');
    }
  }
}

function createEnvironmentFiles(projectPath) {
  log('\n🔐 Creating environment files...', 'blue');
  
  const envExamplePath = path.join(projectPath, 'template', '.env.example');
  const envLocalPath = path.join(projectPath, 'template', '.env.local');
  
  const envExample = `# Environment Variables
# Copy this file to .env.local and fill in your values

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Vercel Configuration (optional)
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
`;
  
  try {
    fs.writeFileSync(envExamplePath, envExample);
    log('  ✅ Created .env.example', 'green');
    
    // Don't create .env.local in template, let user create it
    log('  ℹ️  Remember to create .env.local with your actual values', 'yellow');
  } catch (error) {
    log(`  ❌ Failed to create environment files: ${error.message}`, 'red');
  }
}

function installDependencies(projectPath) {
  log('\n📦 Installing dependencies...', 'blue');
  
  try {
    execSync('npm install', { 
      cwd: projectPath, 
      stdio: 'inherit' 
    });
    log('  ✅ Installed root dependencies', 'green');
    
    execSync('npm install', { 
      cwd: path.join(projectPath, 'template'), 
      stdio: 'inherit' 
    });
    log('  ✅ Installed template dependencies', 'green');
  } catch (error) {
    log(`  ❌ Failed to install dependencies: ${error.message}`, 'red');
    log('  ℹ️  You can install them manually later with: npm install', 'yellow');
  }
}

function createGitRepository(projectPath) {
  log('\n🔧 Initializing Git repository...', 'blue');
  
  try {
    execSync('git init', { cwd: projectPath, stdio: 'pipe' });
    log('  ✅ Initialized Git repository', 'green');
    
    // Create initial commit
    execSync('git add .', { cwd: projectPath, stdio: 'pipe' });
    execSync(`git commit -m "feat: initial commit from Purely Development template"`, { 
      cwd: projectPath, 
      stdio: 'pipe' 
    });
    log('  ✅ Created initial commit', 'green');
  } catch (error) {
    log(`  ❌ Failed to initialize Git: ${error.message}`, 'red');
    log('  ℹ️  You can initialize Git manually later', 'yellow');
  }
}

function displayNextSteps(projectName, projectPath) {
  log('\n🎉 Project created successfully!', 'green');
  log('================================', 'green');
  
  log(`\n📁 Project location: ${projectPath}`, 'blue');
  
  log('\n📋 Next steps:', 'yellow');
  log('1. Navigate to your project:', 'yellow');
  log(`   cd ${projectName}`, 'yellow');
  
  log('\n2. Set up environment variables:', 'yellow');
  log('   cd template', 'yellow');
  log('   cp .env.example .env.local', 'yellow');
  log('   # Edit .env.local with your actual values', 'yellow');
  
  log('\n3. Set up your database:', 'yellow');
  log('   npm run db:migrate', 'yellow');
  log('   npm run db:seed', 'yellow');
  
  log('\n4. Start development:', 'yellow');
  log('   npm run dev', 'yellow');
  
  log('\n5. Run health check:', 'yellow');
  log('   npm run health-check', 'yellow');
  
  log('\n📚 Documentation:', 'blue');
  log('   - Getting Started: docs/getting-started.md', 'blue');
  log('   - Team Onboarding: docs/team-onboarding.md', 'blue');
  log('   - Development Guidelines: docs/development-guidelines.md', 'blue');
  
  log('\n🚀 Happy coding!', 'green');
}

function main() {
  try {
    const { projectName, projectDescription } = getProjectInfo();
    
    log(`${colors.bold}Purely Development - New Project Creator${colors.reset}`, 'blue');
    log('===============================================', 'blue');
    
    const templatePath = process.cwd();
    const projectPath = createProjectDirectory(projectName);
    
    copyTemplateFiles(templatePath, projectPath);
    updateProjectFiles(projectPath, projectName, projectDescription);
    createEnvironmentFiles(projectPath);
    installDependencies(projectPath);
    createGitRepository(projectPath);
    
    displayNextSteps(projectName, projectPath);
    
  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();

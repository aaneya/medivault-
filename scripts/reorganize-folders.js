#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Helper function to create directory if it doesn't exist
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

// Helper function to copy file
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  createDirIfNotExists(destDir);
  fs.copyFileSync(src, dest);
  console.log(`✓ Copied: ${src} → ${dest}`);
}

// Helper function to remove directory recursively
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✓ Removed: ${dirPath}`);
  }
}

const projectRoot = '/vercel/share/v0-project';
const oldRoot = path.join(projectRoot, 'minor project', 'medi_vault');

console.log('Starting project reorganization...\n');

// 1. Create main directories
console.log('Creating main directories...');
createDirIfNotExists(path.join(projectRoot, 'backend'));
createDirIfNotExists(path.join(projectRoot, 'backend', 'app'));
createDirIfNotExists(path.join(projectRoot, 'backend', 'templates'));
createDirIfNotExists(path.join(projectRoot, 'backend', 'tests'));
createDirIfNotExists(path.join(projectRoot, 'frontend'));
createDirIfNotExists(path.join(projectRoot, 'frontend', 'css'));
createDirIfNotExists(path.join(projectRoot, 'frontend', 'js'));
createDirIfNotExists(path.join(projectRoot, 'frontend', 'uploads'));
createDirIfNotExists(path.join(projectRoot, 'docs'));
console.log('');

// 2. Move Flask app files
console.log('Moving Flask app files...');
const appFiles = [
  'app/__init__.py',
  'app/extensions.py',
  'app/routes.py',
  'app/schemas.py',
  'app/services/__init__.py',
  'app/services/blockchain.py',
  'app/services/firestore.py',
  'app/services/hashing.py',
  'app/services/ipfs.py',
  'app/services/notifications.py',
  'app/services/storage.py',
  'app/utils/__init__.py',
  'app/utils/auth.py',
  'app/utils/firestore_json.py',
  'app/utils/validators.py',
];

appFiles.forEach(file => {
  const src = path.join(oldRoot, file);
  const dest = path.join(projectRoot, 'backend', file);
  if (fs.existsSync(src)) {
    copyFile(src, dest);
  }
});
console.log('');

// 3. Move config and run files
console.log('Moving configuration files...');
const configFiles = [
  'config.py',
  'run.py',
  'manage.py',
  'gunicorn.conf.py',
  'requirements.txt',
  'Dockerfile',
  'README.md',
];

configFiles.forEach(file => {
  const src = path.join(oldRoot, file);
  const dest = path.join(projectRoot, 'backend', file);
  if (fs.existsSync(src)) {
    copyFile(src, dest);
  }
});
console.log('');

// 4. Move templates
console.log('Moving templates...');
const templatesDir = path.join(oldRoot, 'templates');
if (fs.existsSync(templatesDir)) {
  fs.readdirSync(templatesDir).forEach(file => {
    const src = path.join(templatesDir, file);
    const dest = path.join(projectRoot, 'backend', 'templates', file);
    if (fs.statSync(src).isFile()) {
      copyFile(src, dest);
    }
  });
}
console.log('');

// 5. Move CSS files
console.log('Moving CSS files...');
const cssDir = path.join(oldRoot, 'static', 'css');
if (fs.existsSync(cssDir)) {
  fs.readdirSync(cssDir).forEach(file => {
    const src = path.join(cssDir, file);
    const dest = path.join(projectRoot, 'frontend', 'css', file);
    if (fs.statSync(src).isFile()) {
      copyFile(src, dest);
    }
  });
}
console.log('');

// 6. Move JS files
console.log('Moving JavaScript files...');
const jsDir = path.join(oldRoot, 'static', 'js');
if (fs.existsSync(jsDir)) {
  fs.readdirSync(jsDir).forEach(file => {
    const src = path.join(jsDir, file);
    const dest = path.join(projectRoot, 'frontend', 'js', file);
    if (fs.statSync(src).isFile()) {
      copyFile(src, dest);
    }
  });
}
console.log('');

// 7. Move tests
console.log('Moving test files...');
const testsDir = path.join(oldRoot, 'tests');
if (fs.existsSync(testsDir)) {
  fs.readdirSync(testsDir).forEach(file => {
    const src = path.join(testsDir, file);
    const dest = path.join(projectRoot, 'backend', 'tests', file);
    if (fs.statSync(src).isFile()) {
      copyFile(src, dest);
    }
  });
}
console.log('');

// 8. Move documentation
console.log('Moving documentation files...');
const docFiles = ['HashAnchor.sol', 'api.yaml', 'deployment.md'];
const oldDocsDir = path.join(oldRoot, 'docs');
if (fs.existsSync(oldDocsDir)) {
  docFiles.forEach(file => {
    const src = path.join(oldDocsDir, file);
    const dest = path.join(projectRoot, 'docs', file);
    if (fs.existsSync(src)) {
      copyFile(src, dest);
    }
  });
}
console.log('');

// 9. Move Firebase config files (to backend since they're shared)
console.log('Moving Firebase configuration files...');
const firebaseFiles = ['firebase.json', 'firestore.indexes.json', 'firestore.rules'];
firebaseFiles.forEach(file => {
  const src = path.join(oldRoot, file);
  const dest = path.join(projectRoot, file);
  if (fs.existsSync(src)) {
    copyFile(src, dest);
  }
});
console.log('');

// 10. Copy app.py if exists
console.log('Checking for root app.py...');
const appPy = path.join(oldRoot, 'app.py');
if (fs.existsSync(appPy)) {
  copyFile(appPy, path.join(projectRoot, 'backend', 'app.py'));
}
console.log('');

console.log('✓ Project reorganization complete!');
console.log('\nFinal structure:');
console.log('  /backend - Flask application code, templates, config, and tests');
console.log('  /frontend - CSS, JavaScript, and uploaded files');
console.log('  /docs - Documentation files');
console.log('  /*.json, /*.rules - Firebase configuration (root level)');

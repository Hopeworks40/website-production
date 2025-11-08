const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting build process...\n');

// Configuration
const SOURCE_DIR = './';
const BUILD_DIR = './dist';

// Files to obfuscate
const jsFilesToObfuscate = [
  'assets/js/tracking.js',
  'assets/js/exces.js',
  'assets/js/cosent.js',
  'assets/js/protection.js',
  'assets/js/config.js',
  'assets/js/main.js'
];

// Files/folders to exclude from copying
const excludeFromCopy = [
  'node_modules',
  'dist',
  '.git',
  'build.js',
  'package.json',
  'package-lock.json',
  '.gitignore',
  'README.md',
  'build-instructions.txt'
];

// Step 1: Create dist directory
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
  console.log('✅ Created dist directory\n');
}

// Step 2: Clean dist directory
console.log('🧹 Cleaning dist directory...');
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  fs.mkdirSync(BUILD_DIR);
}
console.log('✅ Dist directory cleaned\n');

// Step 3: Copy all files to dist (excluding specified folders)
console.log('📁 Copying files to dist...');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy each item in source directory
fs.readdirSync(SOURCE_DIR).forEach(item => {
  if (!excludeFromCopy.includes(item)) {
    const srcPath = path.join(SOURCE_DIR, item);
    const destPath = path.join(BUILD_DIR, item);
    
    try {
      copyRecursiveSync(srcPath, destPath);
      console.log(`  ✓ Copied: ${item}`);
    } catch (err) {
      console.log(`  ✗ Error copying ${item}:`, err.message);
    }
  }
});

console.log('\n✅ Files copied to dist\n');

// Step 4: Check for required packages
console.log('📦 Checking for required packages...');

// Check and install javascript-obfuscator
try {
  execSync('javascript-obfuscator --version', { stdio: 'pipe' });
  console.log('✅ javascript-obfuscator is installed');
} catch (e) {
  console.log('⚠️  javascript-obfuscator not found');
  console.log('📥 Installing javascript-obfuscator globally...\n');
  try {
    execSync('npm install -g javascript-obfuscator', { stdio: 'inherit' });
    console.log('\n✅ javascript-obfuscator installed');
  } catch (err) {
    console.error('❌ Failed to install javascript-obfuscator');
    console.error('Please run: npm install -g javascript-obfuscator');
    process.exit(1);
  }
}

// Check and install required npm packages for minification
console.log('📦 Checking for minification packages...');
try {
  require.resolve('html-minifier-terser');
  require.resolve('clean-css');
  console.log('✅ Minification packages already installed\n');
} catch (e) {
  console.log('📥 Installing minification packages...\n');
  try {
    execSync('npm install html-minifier-terser clean-css --save-dev', { stdio: 'inherit' });
    console.log('\n✅ Minification packages installed\n');
  } catch (err) {
    console.error('❌ Failed to install minification packages');
    console.error('Please run: npm install html-minifier-terser clean-css --save-dev');
    process.exit(1);
  }
}

// Step 5: Obfuscate JavaScript files
console.log('🔒 Obfuscating JavaScript files...\n');

const obfuscatorOptions = [
  '--compact true',
  '--control-flow-flattening true',
  '--control-flow-flattening-threshold 0.75',
  '--dead-code-injection true',
  '--dead-code-injection-threshold 0.4',
  '--debug-protection false',
  '--disable-console-output true',
  '--identifier-names-generator hexadecimal',
  '--log false',
  '--numbers-to-expressions true',
  '--rename-globals false',
  '--self-defending true',
  '--simplify true',
  '--split-strings true',
  '--split-strings-chunk-length 10',
  '--string-array true',
  '--string-array-encoding rc4',
  '--string-array-threshold 0.75',
  '--transform-object-keys true',
  '--unicode-escape-sequence false'
].join(' ');

jsFilesToObfuscate.forEach(file => {
  const distFile = path.join(BUILD_DIR, file);
  
  if (fs.existsSync(distFile)) {
    console.log(`  🔐 Obfuscating: ${file}`);
    
    try {
      // Create backup
      const backupFile = distFile + '.backup';
      fs.copyFileSync(distFile, backupFile);
      
      // Obfuscate
      execSync(`javascript-obfuscator ${distFile} --output ${distFile} ${obfuscatorOptions}`, {
        stdio: 'pipe'
      });
      
      // Remove backup
      fs.unlinkSync(backupFile);
      
      console.log(`  ✅ Successfully obfuscated: ${file}\n`);
    } catch (err) {
      console.log(`  ❌ Error obfuscating ${file}:`, err.message);
    }
  } else {
    console.log(`  ⚠️  File not found: ${file}`);
  }
});

// Step 6: Minify HTML files
console.log('🗜️  Minifying HTML files...\n');

const { minify: minifyHTML } = require('html-minifier-terser');

const htmlFiles = [];
function findHTMLFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findHTMLFiles(filePath);
    } else if (file.endsWith('.html')) {
      htmlFiles.push(filePath);
    }
  });
}

findHTMLFiles(BUILD_DIR);

const htmlMinifyOptions = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
  sortAttributes: true,
  sortClassName: true
};

htmlFiles.forEach(file => {
  try {
    const html = fs.readFileSync(file, 'utf8');
    const minified = minifyHTML(html, htmlMinifyOptions);
    fs.writeFileSync(file, minified);
    
    const relativePath = path.relative(BUILD_DIR, file);
    const originalSize = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(2);
    const minifiedSize = (Buffer.byteLength(minified, 'utf8') / 1024).toFixed(2);
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ✓ ${relativePath}`);
    console.log(`    ${originalSize} KB → ${minifiedSize} KB (${savings}% smaller)\n`);
  } catch (err) {
    console.log(`  ✗ Error minifying ${file}:`, err.message);
  }
});

// Step 7: Minify CSS files
console.log('🗜️  Minifying CSS files...\n');

const CleanCSS = require('clean-css');
const cleanCSS = new CleanCSS({
  level: 2,
  compatibility: 'ie10'
});

const cssFiles = [];
function findCSSFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findCSSFiles(filePath);
    } else if (file.endsWith('.css')) {
      cssFiles.push(filePath);
    }
  });
}

findCSSFiles(BUILD_DIR);

cssFiles.forEach(file => {
  try {
    const css = fs.readFileSync(file, 'utf8');
    const output = cleanCSS.minify(css);
    
    if (output.errors.length > 0) {
      console.log(`  ⚠️  Errors in ${file}:`, output.errors);
    } else {
      fs.writeFileSync(file, output.styles);
      
      const relativePath = path.relative(BUILD_DIR, file);
      const originalSize = (Buffer.byteLength(css, 'utf8') / 1024).toFixed(2);
      const minifiedSize = (Buffer.byteLength(output.styles, 'utf8') / 1024).toFixed(2);
      const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
      
      console.log(`  ✓ ${relativePath}`);
      console.log(`    ${originalSize} KB → ${minifiedSize} KB (${savings}% smaller)\n`);
    }
  } catch (err) {
    console.log(`  ✗ Error minifying ${file}:`, err.message);
  }
});

// Step 8: Create build info file
const buildInfo = {
  buildDate: new Date().toISOString(),
  version: '1.0.0',
  obfuscated: true,
  minified: true,
  files: {
    javascript: jsFilesToObfuscate,
    html: htmlFiles.map(f => path.relative(BUILD_DIR, f)),
    css: cssFiles.map(f => path.relative(BUILD_DIR, f))
  }
};

fs.writeFileSync(
  path.join(BUILD_DIR, 'build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('\n✅ Build completed successfully!');
console.log(`📦 Production files are in: ${BUILD_DIR}`);
console.log('\n📊 Build Summary:');
console.log(`   🔒 Obfuscated: ${jsFilesToObfuscate.length} JavaScript files`);
console.log(`   🗜️  Minified: ${htmlFiles.length} HTML files`);
console.log(`   🗜️  Minified: ${cssFiles.length} CSS files`);
console.log('\n📋 Next steps:');
console.log('   1. Test the dist folder locally');
console.log('   2. Deploy dist folder to production');
console.log('   3. Push original code to private repo');
console.log('   4. Push dist folder to public repo\n');

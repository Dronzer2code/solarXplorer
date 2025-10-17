const fs = require('fs/promises');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'public');

const excludedDirs = new Set([
  'node_modules',
  'public',
  'api',
  '.git',
  '.github',
  '.vercel',
  'scripts'
]);

const excludedFiles = new Set([
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'yarn.lock',
  'vercel.json',
  '.env',
  '.env.example',
  'server.js',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'DEPLOYMENT.md',
  'PRODUCTION-CHECKLIST.md'
].map((name) => name.toLowerCase()));

const allowedExtensions = new Set([
  '.html',
  '.css',
  '.js',
  '.mjs',
  '.cjs',
  '.json',
  '.txt',
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.mp4',
  '.webm',
  '.mp3',
  '.wav',
  '.ogg',
  '.glb',
  '.gltf',
  '.wasm',
  '.data',
  '.map',
  '.xml',
  '.webp',
  '.avif',
  '.pdf',
  '.ttf',
  '.otf',
  '.woff',
  '.woff2'
]);

const explicitlyIncludedFiles = new Set([
  'robots.txt',
  'cname',
  'favicon.ico',
  'manifest.json',
  'humans.txt'
].map((name) => name.toLowerCase()));

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function cleanOutputDir() {
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
}

async function copyStaticAssets(currentDir, relativePath = '.') {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  let copied = 0;

  for (const entry of entries) {
    const entryName = entry.name;
    const lowerName = entryName.toLowerCase();

    if (lowerName.startsWith('.git')) {
      continue;
    }

    const absolutePath = path.join(currentDir, entryName);
    const destinationRelative = relativePath === '.'
      ? entryName
      : path.join(relativePath, entryName);

    if (entry.isDirectory()) {
      if (excludedDirs.has(entryName)) {
        continue;
      }
      copied += await copyStaticAssets(absolutePath, destinationRelative);
      continue;
    }

    if (excludedFiles.has(lowerName)) {
      continue;
    }

    const ext = path.extname(entryName).toLowerCase();
    const shouldInclude = allowedExtensions.has(ext) || explicitlyIncludedFiles.has(lowerName);

    if (!shouldInclude) {
      continue;
    }

    const destinationPath = path.join(outputDir, destinationRelative);
    await ensureDir(path.dirname(destinationPath));
    await fs.copyFile(absolutePath, destinationPath);
    copied += 1;
  }

  return copied;
}

(async () => {
  try {
    await cleanOutputDir();
    const totalCopied = await copyStaticAssets(projectRoot);
    console.log(`Static build complete. Files copied: ${totalCopied}`);
  } catch (error) {
    console.error('Failed to build static assets:', error);
    process.exitCode = 1;
  }
})();

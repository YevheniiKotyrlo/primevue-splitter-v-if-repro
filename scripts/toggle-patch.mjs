import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const PACKAGE_JSON = resolve('package.json');
const PATCHED_DEPENDENCIES = {
  'primevue@4.5.4': 'patches/primevue@4.5.4.patch',
};

const action = process.argv[2];

if (action !== 'apply' && action !== 'revert') {
  console.error('Usage: node scripts/toggle-patch.mjs <apply|revert>');
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'));

if (action === 'apply') {
  if (packageJson.patchedDependencies) {
    console.log('Patch already active in package.json.');
    process.exit(0);
  }
  packageJson.patchedDependencies = PATCHED_DEPENDENCIES;
  writeFileSync(PACKAGE_JSON, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('Added patchedDependencies to package.json');
  execSync('bun install', { stdio: 'inherit' });
  console.log('Patch applied via bun install.');
} else {
  if (!packageJson.patchedDependencies) {
    console.log('Patch already inactive.');
    process.exit(0);
  }
  delete packageJson.patchedDependencies;
  writeFileSync(PACKAGE_JSON, JSON.stringify(packageJson, null, 2) + '\n');
  console.log('Removed patchedDependencies from package.json');
  execSync('bun install', { stdio: 'inherit' });
  console.log('Patch reverted via bun install.');
}

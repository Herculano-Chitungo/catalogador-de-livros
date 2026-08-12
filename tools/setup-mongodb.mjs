import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFilePath = path.join(workspaceRoot, '.env.local');
const vscodeConnectionPath = path.join(workspaceRoot, '.vscode', 'mongodb-uri.txt');
const defaultMongoUri = 'mongodb://127.0.0.1:27017';

function isDevContainer() {
  return Boolean(process.env.REMOTE_CONTAINERS || process.env.DEVCONTAINER || fs.existsSync('/.dockerenv'));
}

function detectMongoUriFromDocker() {
  try {
    const containerNames = execFileSync('docker', ['ps', '--filter', 'ancestor=mongo', '--format', '{{.Names}}'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    for (const containerName of containerNames) {
      try {
        const portOutput = execFileSync('docker', ['port', containerName, '27017/tcp'], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();

        const hostPortMatch = portOutput.match(/:(\d+)$/m);
        if (hostPortMatch) {
          return `mongodb://127.0.0.1:${hostPortMatch[1]}`;
        }
      } catch {
        // Ignore containers without a published MongoDB port.
      }

      return `mongodb://${containerName}:27017`;
    }
  } catch {
    // Ignore Docker lookup failures and fall back below.
  }

  return null;
}

function resolveMongoUri() {
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) {
    return process.env.MONGODB_URI.trim();
  }

  if (isDevContainer()) {
    return defaultMongoUri;
  }

  return detectMongoUriFromDocker() ?? defaultMongoUri;
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

const mongoUri = resolveMongoUri();

writeFile(envFilePath, `MONGODB_URI=${mongoUri}\n`);
writeFile(vscodeConnectionPath, `${mongoUri}\n`);

console.log(`Wrote ${path.relative(workspaceRoot, envFilePath)}`);
console.log(`Wrote ${path.relative(workspaceRoot, vscodeConnectionPath)}`);
console.log(`MongoDB URI: ${mongoUri}`);

import fs from 'node:fs';
import path from 'node:path';

const defaultMongoUri = 'mongodb+srv://admin:123@cluster0.q69ozlb.mongodb.net/catalogo_livros?retryWrites=true&w=majority&appName=Cluster0';
const envFilePath = path.resolve(process.cwd(), '.env.local');

function readMongoUriFromEnvFile() {
  if (!fs.existsSync(envFilePath)) {
    return null;
  }

  const envFileContents = fs.readFileSync(envFilePath, 'utf8');
  const mongoLine = envFileContents
    .split(/\r?\n/)
    .find((line) => line.startsWith('MONGODB_URI='));

  if (!mongoLine) {
    return null;
  }

  return mongoLine.slice('MONGODB_URI='.length).trim().replace(/^"|"$/g, '');
}

export function getMongoDbUri() {
  return process.env.MONGODB_URI ?? readMongoUriFromEnvFile() ?? defaultMongoUri;
}

export const mongodbUri = getMongoDbUri();
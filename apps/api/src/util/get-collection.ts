import { MongoClient, Collection, Document } from 'mongodb';
import { mongodbUri } from '../mongodb-uri';

let client: MongoClient;

export async function getCollection<T extends Document = Document>(
  arg1: any,
  arg2?: string
): Promise<Collection<T>> {
  if (!client) {
    client = new MongoClient(mongodbUri);
    await client.connect();
  }

  const collectionName = typeof arg2 === 'string' ? arg2 : arg1;

  return client.db('catalogo_livros').collection<T>(collectionName);
}
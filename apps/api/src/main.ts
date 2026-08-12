/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { mongodbUri } from './mongodb-uri';

import { MongoClient } from 'mongodb';

import cors from 'cors';

import { json } from 'body-parser';

import { livroRouter } from './routes/livro.router';
import { authRouter } from './routes/auth.router';

const app = express();

// Usar CORS antes dos middlewares de roteamento:
app.use(cors());

// Processar corpo da requisição HTTP antes das rotas que necessitam desse corpo:
app.use(json());

MongoClient.connect(mongodbUri).then((client: MongoClient) => {
  app.locals.db = client.db('catalogo_livros');
  console.log(`Conectado ao MongoDB.`);
}).catch(err => {
  console.error(err);
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.use('/api/livros', livroRouter);
app.use('/api/auth', authRouter);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
  console.log(`MongoDB connection configured from ${mongodbUri}`);
});
server.on('error', console.error);
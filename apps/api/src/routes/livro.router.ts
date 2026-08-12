import { Router } from 'express';
import { getCollection } from '../util/get-collection';
import { ObjectId } from 'mongodb';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const collection = await getCollection(req.app, 'livros');
    const livros = await collection.find({}).toArray();
    const formatados = livros.map(l => ({ ...l, id: l._id.toString() }));
    res.json(formatados);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar livros' });
  }
});

router.post('/', async (req, res) => {
  try {
    const collection = await getCollection(req.app, 'livros');
    const novoLivro = req.body;
    delete novoLivro.id;
    delete novoLivro._id;
    
    const resultado = await collection.insertOne(novoLivro);
    res.status(201).json({ ...novoLivro, _id: resultado.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar livro' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const collection = await getCollection(req.app, 'livros');
    const { id } = req.params;
    const dadosAtualizados = { ...req.body };
    
    delete dadosAtualizados.id;
    delete dadosAtualizados._id;

    let filtro: any = { id: id };
    if (ObjectId.isValid(id)) {
      filtro = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    }

    const resultado = await collection.updateOne(filtro, { $set: dadosAtualizados });

    if (resultado.matchedCount === 0) {
      const insertRes = await collection.insertOne(dadosAtualizados);
      return res.json({ ...dadosAtualizados, _id: insertRes.insertedId });
    }

    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    console.error('Erro no PUT:', error);
    res.status(500).json({ error: 'Erro ao atualizar livro' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const collection = await getCollection(req.app, 'livros');
    const { id } = req.params;

    let filtro: any = { id: id };
    if (ObjectId.isValid(id)) {
      filtro = { $or: [{ _id: new ObjectId(id) }, { id: id }] };
    }

    await collection.deleteOne(filtro);
    res.status(204).send();
  } catch (error) {
    console.error('Erro no DELETE:', error);
    res.status(500).json({ error: 'Erro ao remover livro' });
  }
});

export const livroRouter = router;
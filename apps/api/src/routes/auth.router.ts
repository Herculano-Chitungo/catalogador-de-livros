import { NextFunction, Request, Response, Router } from 'express';
import { getCollection } from '../util/get-collection';

export const authRouter = Router();

interface Usuario {
  usuario: string;
  senha: string;
}

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { usuario, senha } = req.body;
    const user = await (await getCollection<Usuario>(req.app, 'usuarios')).findOne({ usuario, senha });

    if (user) {
      res.json({ success: true, message: 'Autenticado com sucesso', usuario: user.usuario });
    } else {
      res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }
  } catch (error) {
    return next(error);
  }
});
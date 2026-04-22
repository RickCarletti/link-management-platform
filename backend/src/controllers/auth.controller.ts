import { Request, Response } from 'express';
import { createUser } from '../services/user.service.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // validação básica
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const user = await createUser({ name, email, password });

    // remove password da resposta
    const { password: _, ...safeUser } = user;

    return res.status(201).json(safeUser);
  } catch (error: any) {
    if (error.message === 'Email already in use') {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

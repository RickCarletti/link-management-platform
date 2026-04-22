import { Request, Response } from 'express';
import { authenticateUser, createUser } from '../services/user.service.js';
import { generateToken } from '../utils/jwt.js';

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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing email or password',
      });
    }

    const user = await authenticateUser(email, password);

    const token = generateToken({ userId: user.id });

    return res.status(200).json({
      token,
    });
  } catch (error: any) {
    return res.status(401).json({
      message: 'Invalid credentials',
    });
  }
};

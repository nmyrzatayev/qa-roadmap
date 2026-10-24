import { Router } from 'express';
import { dbService } from '../data/database.js';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    const user = await dbService.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Неверный логин или пароль" });
    }

    res.json({
      token: `qa-token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Все поля (name, email, password) обязательны" });
    }

    if (password.length < 6) {
      return res.status(422).json({ error: "Пароль должен содержать минимум 6 символов" });
    }

    const existing = await dbService.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Пользователь с таким email уже существует" });
    }

    const newUser = await dbService.createUser({ name, email, password, role: 'user' });

    res.status(201).json({
      token: `qa-token-${newUser.id}-${Date.now()}`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

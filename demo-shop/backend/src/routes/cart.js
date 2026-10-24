import { Router } from 'express';
import { dbService } from '../data/database.js';

const router = Router();

// GET /api/v1/cart
router.get('/', async (req, res) => {
  try {
    const items = await dbService.getCart();
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items, totalAmount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/cart/items
router.post('/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "Параметр productId обязателен" });
    }

    const result = await dbService.addToCart(productId, Number(quantity) || 1);
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/cart/items
router.put('/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ error: "Параметры productId и quantity обязательны" });
    }

    const result = await dbService.updateCartItem(productId, Number(quantity));
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/cart/items/:productId
router.delete('/items/:productId', async (req, res) => {
  try {
    const result = await dbService.removeFromCart(req.params.productId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/cart
router.delete('/', async (req, res) => {
  try {
    await dbService.clearCart();
    res.json({ success: true, message: "Корзина полностью очищена" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

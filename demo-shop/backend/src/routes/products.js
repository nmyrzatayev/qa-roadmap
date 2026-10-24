import { Router } from 'express';
import { dbService } from '../data/database.js';

const router = Router();

// GET /api/v1/products
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page, limit } = req.query;
    const result = await dbService.getProducts({ search, category, minPrice, maxPrice, sort, page, limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await dbService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Товар с указанным ID не найден" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/products
router.post('/', async (req, res) => {
  try {
    const { title, category, price, stock, description, imageUrl } = req.body;

    if (!title || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ 
        error: "Поля title, category, price и stock обязательны для заполнения" 
      });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ error: "Цена и остаток не могут быть отрицательными" });
    }

    const created = await dbService.addProduct({ title, category, price: Number(price), stock: Number(stock), description, imageUrl });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const success = await dbService.deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Товар не найден" });
    }
    res.json({ success: true, message: "Товар успешно удален" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

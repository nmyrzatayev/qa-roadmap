import { Router } from 'express';
import { dbService } from '../data/database.js';

const router = Router();

// GET /api/v1/orders
router.get('/', async (req, res) => {
  try {
    const orders = await dbService.getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/v1/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Поле status обязательно (PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED)" });
    }
    const result = await dbService.updateOrderStatus(req.params.id, status);
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/orders/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { customer, items, promoCode } = req.body;

    if (!customer) {
      return res.status(400).json({ error: "Данные покупателя (customer) обязательны" });
    }

    const { name, email, phone, address } = customer;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ 
        error: "Обязательные поля: ФИО (name), Email (email), Телефон (phone), Адрес доставки (address)" 
      });
    }

    // Simple email format validation
    if (!email.includes('@') || !email.includes('.')) {
      return res.status(422).json({ error: "Некорректный формат адреса электронной почты" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Нельзя оформить заказ с пустой корзиной" });
    }

    const result = await dbService.createOrder({ customer, items, promoCode });
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

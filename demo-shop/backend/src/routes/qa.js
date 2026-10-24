import { Router } from 'express';
import { dbService } from '../data/database.js';

const router = Router();

// POST /api/v1/qa/reset
router.post('/reset', async (req, res) => {
  try {
    const result = await dbService.resetDatabase();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/qa/simulate-chaos
router.post('/simulate-chaos', async (req, res) => {
  try {
    const { delayMs, forceStatus, isBuggyMode } = req.body;
    const settings = await dbService.updateQaSettings({ delayMs, forceStatus, isBuggyMode });
    res.json({
      success: true,
      message: "Настройки симуляции и Buggy Mode обновлены в PostgreSQL",
      settings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/qa/status
router.get('/status', async (req, res) => {
  try {
    const settings = await dbService.getQaSettings();
    const stats = await dbService.getStats();
    res.json({ settings, stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

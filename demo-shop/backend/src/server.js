import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger.js';
import { dbService } from './data/database.js';

import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import qaRouter from './routes/qa.js';
import postmanRouter from './routes/postman.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// QA Chaos Middleware: reads settings from PostgreSQL
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api-docs') || req.path.startsWith('/api/v1/qa') || req.path.startsWith('/api/v1/postman')) {
    return next();
  }

  try {
    const settings = await dbService.getQaSettings();
    if (settings.artificialDelayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, settings.artificialDelayMs));
    }

    if (settings.forceErrorStatus) {
      return res.status(settings.forceErrorStatus).json({
        error: `[SIMULATED_CHAOS] Искусственный сбой сервера (HTTP ${settings.forceErrorStatus})`,
        message: "Сбой включен через панель QA Tools для проверки отказоустойчивости клиента"
      });
    }
  } catch (err) {
    // If db connection error, pass through
  }

  next();
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customSiteTitle: "QA E-Commerce API Docs (Swagger)",
  customCss: '.swagger-ui .topbar { background-color: #1e293b; }'
}));

// API Routes
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/qa', qaRouter);
app.use('/api/v1/postman', postmanRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: "OK", 
    database: dbService.dataSource.isInitialized ? "PostgreSQL (Connected)" : "Disconnected",
    timestamp: new Date().toISOString() 
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.6;">
      <h2>🛒 QA E-Commerce Backend (PostgreSQL + TypeORM)</h2>
      <p>Бэкенд успешно запущен и подключен к PostgreSQL!</p>
      <ul>
        <li>📖 <a href="/api-docs"><b>Открыть интерактивную документацию Swagger UI (/api-docs)</b></a></li>
        <li>🚀 <a href="/api/v1/postman"><b>Инструкции и экспорт коллекции для Postman (/api/v1/postman)</b></a></li>
        <li>🛍️ API товаров: <code>/api/v1/products</code></li>
        <li>🧺 API корзины: <code>/api/v1/cart</code></li>
        <li>📦 API заказов: <code>/api/v1/orders</code></li>
        <li>🧪 QA Chaos Tools: <code>/api/v1/qa/status</code></li>
      </ul>
    </div>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Эндпоинт ${req.method} ${req.url} не найден` });
});

// Connect to DB with retry logic and start Express
async function startServer() {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await dbService.initialize();
      break;
    } catch (err) {
      retries++;
      console.error(`⚠️ Database connection attempt ${retries}/${maxRetries} failed: ${err.message}`);
      if (retries >= maxRetries) {
        console.error('❌ Could not connect to PostgreSQL after multiple attempts. Exiting...');
        process.exit(1);
      }
      console.log('⏳ Waiting 3 seconds before next retry...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  app.listen(PORT, () => {
    console.log(`✅ Backend server running at http://localhost:${PORT}`);
    console.log(`📖 Swagger API Docs available at http://localhost:${PORT}/api-docs`);
  });
}

startServer();

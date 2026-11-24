import { Router } from 'express';
import { swaggerDocument } from '../swagger.js';

const router = Router();

// Full Postman Collection v2.1.0 generator with ready-to-use tests
function generatePostmanCollection(baseUrl) {
  return {
    info: {
      name: "QA Sandbox E-Commerce (Postman Training Collection)",
      _postman_id: "qa-sandbox-ecommerce-v1",
      description: "Готовая коллекция запросов с предустановленными проверками (pm.test) и тестами для изучения API-тестирования в Postman.",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
      {
        key: "baseUrl",
        value: baseUrl,
        type: "string"
      },
      {
        key: "token",
        value: "",
        type: "string"
      }
    ],
    item: [
      {
        name: "01. Auth (Авторизация)",
        item: [
          {
            name: "Login - Успешный вход (Сохраняет токен)",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 200 OK', function () {",
                    "    pm.response.to.have.status(200);",
                    "});",
                    "",
                    "pm.test('Response contains token and user object', function () {",
                    "    var data = pm.response.json();",
                    "    pm.expect(data).to.have.property('token');",
                    "    pm.expect(data).to.have.property('user');",
                    "    pm.expect(data.user.email).to.eql('tester@qa.com');",
                    "    // Автоматическое сохранение токена в переменную коллекции",
                    "    pm.collectionVariables.set('token', data.token);",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({ email: "tester@qa.com", password: "password123" }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/v1/auth/login",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "auth", "login"]
              }
            }
          },
          {
            name: "Login - Неверный пароль (Негативный 401)",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 401 Unauthorized', function () {",
                    "    pm.response.to.have.status(401);",
                    "});",
                    "pm.test('Error message is present', function () {",
                    "    var data = pm.response.json();",
                    "    pm.expect(data.error).to.include('Неверный логин или пароль');",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({ email: "tester@qa.com", password: "WRONG_PASSWORD" }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/v1/auth/login",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "auth", "login"]
              }
            }
          }
        ]
      },
      {
        name: "02. Products (Товары)",
        item: [
          {
            name: "Get Products - Список всех товаров",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 200 OK', function () {",
                    "    pm.response.to.have.status(200);",
                    "});",
                    "pm.test('Response has pagination and items array', function () {",
                    "    var data = pm.response.json();",
                    "    pm.expect(data).to.have.property('items');",
                    "    pm.expect(data.items).to.be.an('array');",
                    "    pm.expect(data.items.length).to.be.above(0);",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "GET",
              url: {
                raw: "{{baseUrl}}/api/v1/products?page=1&limit=10",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "products"],
                query: [
                  { key: "page", value: "1" },
                  { key: "limit", value: "10" }
                ]
              }
            }
          },
          {
            name: "Get Products - Поиск и фильтрация по категории",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 200 OK', function () {",
                    "    pm.response.to.have.status(200);",
                    "});",
                    "pm.test('All returned items match category', function () {",
                    "    var data = pm.response.json();",
                    "    data.items.forEach(function(item) {",
                    "        pm.expect(item.category).to.eql('Электроника');",
                    "    });",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "GET",
              url: {
                raw: "{{baseUrl}}/api/v1/products?category=Электроника&sort=price_asc",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "products"],
                query: [
                  { key: "category", value: "Электроника" },
                  { key: "sort", value: "price_asc" }
                ]
              }
            }
          },
          {
            name: "Get Product by ID (Позитивный)",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 200 OK', function () {",
                    "    pm.response.to.have.status(200);",
                    "});",
                    "pm.test('Product ID is 1', function () {",
                    "    var data = pm.response.json();",
                    "    pm.expect(data.id).to.eql(1);",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "GET",
              url: {
                raw: "{{baseUrl}}/api/v1/products/1",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "products", "1"]
              }
            }
          },
          {
            name: "Get Product by ID - Несуществующий (Негативный 404)",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 404 Not Found', function () {",
                    "    pm.response.to.have.status(404);",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "GET",
              url: {
                raw: "{{baseUrl}}/api/v1/products/99999",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "products", "99999"]
              }
            }
          }
        ]
      },
      {
        name: "03. Cart (Корзина)",
        item: [
          {
            name: "Get Cart - Получить содержимое корзины",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 200 OK', function () {",
                    "    pm.response.to.have.status(200);",
                    "});",
                    "pm.test('Response has items and totalAmount', function () {",
                    "    var data = pm.response.json();",
                    "    pm.expect(data).to.have.property('items');",
                    "    pm.expect(data).to.have.property('totalAmount');",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "GET",
              url: {
                raw: "{{baseUrl}}/api/v1/cart",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "cart"]
              }
            }
          },
          {
            name: "Add Item to Cart (Позитивный)",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 200 OK', function () {",
                    "    pm.response.to.have.status(200);",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({ productId: 1, quantity: 1 }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/v1/cart/items",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "cart", "items"]
              }
            }
          },
          {
            name: "Clear Cart - Очистить корзину",
            request: {
              method: "DELETE",
              url: {
                raw: "{{baseUrl}}/api/v1/cart",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "cart"]
              }
            }
          }
        ]
      },
      {
        name: "04. Orders (Оформление заказов)",
        item: [
          {
            name: "Checkout - Успешное оформление заказа со скидкой",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 201 Created', function () {",
                    "    pm.response.to.have.status(201);",
                    "});",
                    "pm.test('Order ID generated and discount applied', function () {",
                    "    var data = pm.response.json();",
                    "    pm.expect(data.success).to.be.true;",
                    "    pm.expect(data.order.id).to.match(/^ORD-/);",
                    "    pm.expect(data.order.discount).to.be.above(0);",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  customer: {
                    name: "QA Автотестер",
                    email: "postman-tester@qa.com",
                    phone: "+7 (999) 555-44-33",
                    address: "г. Тестовый, ул. Постмана, д. 21",
                    paymentMethod: "CARD"
                  },
                  promoCode: "QA2026",
                  items: [
                    { productId: 1, quantity: 1 }
                  ]
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/v1/orders/checkout",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "orders", "checkout"]
              }
            }
          },
          {
            name: "Checkout - Невалидный Email (Негативный 422)",
            event: [
              {
                listen: "test",
                script: {
                  exec: [
                    "pm.test('Status code is 422 Unprocessable Entity', function () {",
                    "    pm.response.to.have.status(422);",
                    "});",
                    "pm.test('Correct error validation message', function () {",
                    "    var data = pm.response.json();",
                    "    pm.expect(data.error).to.include('Некорректный формат');",
                    "});"
                  ],
                  type: "text/javascript"
                }
              }
            ],
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({
                  customer: {
                    name: "Иван",
                    email: "INVALID_EMAIL_WITHOUT_AT",
                    phone: "+7 999 000-00-00",
                    address: "Адрес"
                  },
                  items: [{ productId: 1, quantity: 1 }]
                }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/v1/orders/checkout",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "orders", "checkout"]
              }
            }
          }
        ]
      },
      {
        name: "05. QA Chaos Tools (Сбои и сброс)",
        item: [
          {
            name: "QA - Сбросить базу данных (Reset)",
            request: {
              method: "POST",
              url: {
                raw: "{{baseUrl}}/api/v1/qa/reset",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "qa", "reset"]
              }
            }
          },
          {
            name: "QA - Включить задержку 1500мс",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({ delayMs: 1500, forceStatus: null }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/v1/qa/simulate-chaos",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "qa", "simulate-chaos"]
              }
            }
          },
          {
            name: "QA - Симуляция ошибки 500",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({ delayMs: 0, forceStatus: 500 }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/v1/qa/simulate-chaos",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "qa", "simulate-chaos"]
              }
            }
          },
          {
            name: "QA - Восстановить штатный режим (Clear Chaos)",
            request: {
              method: "POST",
              header: [{ key: "Content-Type", value: "application/json" }],
              body: {
                mode: "raw",
                raw: JSON.stringify({ delayMs: 0, forceStatus: null, isBuggyMode: false }, null, 2)
              },
              url: {
                raw: "{{baseUrl}}/api/v1/qa/simulate-chaos",
                host: ["{{baseUrl}}"],
                path: ["api", "v1", "qa", "simulate-chaos"]
              }
            }
          }
        ]
      }
    ]
  };
}

// 1. GET /api/v1/postman/collection.json (Ready Postman Collection v2.1)
router.get('/collection.json', (req, res) => {
  const host = req.get('host') || 'localhost:5000';
  const protocol = req.protocol || 'http';
  const baseUrl = `${protocol}://${host}`;

  const collection = generatePostmanCollection(baseUrl);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="qa-shop-postman-collection.json"');
  res.json(collection);
});

// 2. GET /api/v1/postman/openapi.json (OpenAPI 3.0 specification for direct Postman Import)
router.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerDocument);
});

// 3. GET /api/v1/postman/instructions (JSON Instructions for automation & API consumers)
router.get('/instructions', (req, res) => {
  const host = req.get('host') || 'localhost:5000';
  const protocol = req.protocol || 'http';
  const baseUrl = `${protocol}://${host}`;

  res.json({
    title: "Инструкция по импорту API в Postman",
    app: "QA E-Commerce Practice App",
    importMethods: [
      {
        method: "Вариант 1 (Рекомендуемый): Готовая коллекция с тестами (JSON)",
        url: `${baseUrl}/api/v1/postman/collection.json`,
        steps: [
          "1. Откройте Postman",
          "2. Нажмите кнопку 'Import' в левом верхнем углу",
          `3. Вставьте ссылку: ${baseUrl}/api/v1/postman/collection.json или скачайте файл по ссылке и перетащите в окно импорта`,
          "4. Нажмите 'Import'. В вашей рабочей области появится готовая коллекция с папками и встроенными JavaScript-проверками (pm.test)!"
        ]
      },
      {
        method: "Вариант 2: Импорт схемы OpenAPI / Swagger",
        url: `${baseUrl}/api/v1/postman/openapi.json`,
        steps: [
          "1. В Postman нажмите 'Import'",
          `2. В поле URL вставьте: ${baseUrl}/api/v1/postman/openapi.json`,
          "3. Postman автоматически сгенерирует коллекцию на базе OpenAPI 3.0"
        ]
      }
    ],
    collectionVariables: {
      baseUrl: baseUrl,
      token: "Автоматически сохраняется в переменную при успешном запросе 'Login'"
    },
    practiceTasks: [
      "Запустить всю коллекцию разом через Postman Collection Runner (кнопка Run)",
      "Проверить статус-коды 200, 201, 401, 404, 409, 422",
      "Протестировать поведение при включенной в QA Tools ошибке 500"
    ]
  });
});

// 4. GET /api/v1/postman (Interactive HTML landing page with 1-click Download buttons)
router.get('/', (req, res) => {
  const host = req.get('host') || 'localhost:5000';
  const protocol = req.protocol || 'http';
  const baseUrl = `${protocol}://${host}`;

  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>Инструкция по работе с Postman | QA Sandbox</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 40px 20px; line-height: 1.6; }
        .container { max-width: 760px; margin: 0 auto; background: #ffffff; padding: 36px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
        h1 { color: #ff6c37; font-size: 1.8rem; display: flex; align-items: center; gap: 12px; margin-top: 0; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
        .btn-orange { background: #ff6c37; color: #fff; }
        .btn-orange:hover { background: #e05624; }
        .btn-gray { background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; }
        .btn-gray:hover { background: #e2e8f0; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
        code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        pre { background: #1e293b; color: #f8fafc; padding: 14px; border-radius: 8px; overflow-x: auto; font-size: 0.85rem; }
        .step { display: flex; gap: 12px; margin-bottom: 12px; }
        .step-num { background: #ff6c37; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; flex-shrink: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Инструкция по импорту в Postman</h1>
        <p>Для тестировщиков подготовлена готовая коллекция со всеми эндпоинтами интернет-магазина, настроенными переменными окружения и встроенными JavaScript-проверками <code>pm.test</code>.</p>
        
        <div style="display: flex; gap: 12px; margin: 24px 0; flex-wrap: wrap;">
          <a href="/api/v1/postman/collection.json" download class="btn btn-orange">
            📥 Скачать готовую коллекцию Postman (JSON)
          </a>
          <a href="/api/v1/postman/openapi.json" target="_blank" class="btn btn-gray">
            📄 Схема OpenAPI 3.0 (JSON)
          </a>
          <a href="/api-docs" class="btn btn-gray">
            📖 Открыть Swagger UI
          </a>
        </div>

        <div class="card">
          <h3 style="margin-top: 0;">⚡ Быстрый импорт по прямой ссылке (Link Import)</h3>
          <p>Вам даже не нужно скачивать файл на диск. Скопируйте ссылку ниже:</p>
          <pre><code>${baseUrl}/api/v1/postman/collection.json</code></pre>
          <div class="step">
            <div class="step-num">1</div>
            <div>Откройте Postman и нажмите <b>Import</b> в верхнем левом углу.</div>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <div>Вставьте скопированный URL в строку импорта и нажмите <b>Import</b>.</div>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <div>В вашем списке коллекций появится <b>QA Sandbox E-Commerce</b> со всеми тестами!</div>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-top: 0;">✨ Что уже включено в коллекцию:</h3>
          <ul>
            <li><b>Авто-сохранение токена</b>: При выполнении запроса <code>Login</code> JWT-токен автоматически записывается в переменную <code>{{token}}</code>.</li>
            <li><b>Автотесты на каждый запрос</b>: Проверки статус-кодов (200, 201, 401, 404, 422), валидация тела JSON и времени ответа.</li>
            <li><b>Запуск через Collection Runner</b>: Вы можете нажать <i>Run Collection</i> и прогнать все тесты магазина за 2 секунды.</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

export default router;

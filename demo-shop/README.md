# 🛒 QA E-Commerce Sandbox & Practice App (PostgreSQL + TypeORM + Docker)

Учебный полнофункциональный проект интернет-магазина, разработанный специально как полигон для практики тестирования:
- **База данных**: PostgreSQL 16 (с автоматической синхронизацией схемы через TypeORM и сидингом начальных данных).
- **Backend**: Node.js Express + TypeORM + **Swagger UI (OpenAPI 3.0)** со схемами данных и интерактивным запуском запросов «Try it out».
- **Frontend**: React + Vite (каталог, фильтры, поиск, корзина с промокодами, оформление заказа, панель QA Tools).
- **Docker Compose**: Полный стек (PostgreSQL, Backend, Frontend) разворачивается одной командой.

---

## 🚀 Запуск всего проекта одной командой через Docker Compose

### Шаг 1. Убедитесь, что запущен Docker Desktop
Запустите приложение **Docker Desktop** на вашем компьютере.

### Шаг 2. Запуск контейнеров
В корне проекта выполните:
```bash
docker compose up --build
```
*(Или в фоновом режиме: `docker compose up -d --build`)*

Docker автоматически:
1. Запустит контейнер с **PostgreSQL 16** и создаст базу `qashop`.
2. Дождется готовности базы данных (`service_healthy`).
3. Соберет и запустит контейнер **Backend** на порту `5000`.
4. TypeORM создаст таблицы (`products`, `orders`, `cart_items`, `users`, `qa_settings`) и наполнит их товарами.
5. Соберет контейнер **Frontend** с Nginx на порту `5173`.

---

## 🌐 Ссылки на запущенные сервисы

| Сервис | Адрес | Описание |
| :--- | :--- | :--- |
| **🛍️ Интернет-магазин (React)** | 👉 [`http://localhost:5173`](http://localhost:5173) | Полнофункциональный UI магазина |
| **📖 Swagger UI (Документация API)**| 👉 [`http://localhost:5000/api-docs`](http://localhost:5000/api-docs) | Интерактивное тестирование всех эндпоинтов |
| **🐘 База данных PostgreSQL** | `localhost:5432` | Доступ для DBeaver, DataGrip, pgAdmin |

### Параметры подключения к PostgreSQL для QA:
- **Хост**: `localhost`
- **Порт**: `5432`
- **База данных**: `qashop`
- **Пользователь**: `postgres`
- **Пароль**: `postgres`

---

## 🎯 Архитектура проекта

```
                         [ QA Инженер / Тестировщик ]
                         /            │             \
                        /             │              \
          HTTP :5173   /   HTTP :5000 │    TCP :5432  \ (DBeaver / DataGrip)
                      ▼               ▼                ▼
         ┌──────────────────┐ ┌────────────────┐ ┌─────────────────┐
         │  React Frontend  │ │ Node Express   │ │  PostgreSQL 16  │
         │  (Vite + Nginx)  │ │ + Swagger UI   │ │                 │
         │                  │ │ + TypeORM      │ │  - products     │
         │  - Каталог       │ │                │ │  - orders       │
         │  - Корзина       │ │  - Endpoints   │ │  - cart_items   │
         │  - Чекаут        │ │  - Chaos Eng.  │ │  - users        │
         │  - 🧪 QA Sandbox │ │                │ │  - qa_settings  │
         └──────────────────┘ └───────┬────────┘ └────────▲────────┘
                                      │                   │
                                      └───── TypeORM ─────┘
                                        (ORM Connection)
```

---

## 🐘 Практика SQL для тестировщика (Связка с разделом 04)

Подключитесь к базе через DBeaver или консоль `docker exec -it qa-shop-postgres psql -U postgres -d qashop` и попрактикуйтесь в реальных SQL-запросах:

### 1. Проверка остатков товаров
```sql
-- Найти товары, которых нет в наличии (stock = 0)
SELECT id, title, category, price, stock 
FROM products 
WHERE stock = 0;

-- Топ-3 самых дорогих товаров в категории 'Электроника'
SELECT title, price, stock 
FROM products 
WHERE category = 'Электроника' 
ORDER BY price DESC 
LIMIT 3;
```

### 2. Проверка созданных заказов после оформления в UI
```sql
-- Посмотреть последние оформленные заказы
SELECT id, "customerName", "customerEmail", "paymentMethod", total, "createdAt" 
FROM orders 
ORDER BY "createdAt" DESC;
```

---

## 🧪 Специальные фичи: QA Chaos Sandbox

В правом верхнем углу интерфейса магазина доступна кнопка **«🧪 QA Sandbox»**:
1. **Искусственная задержка сети (Latency Simulation)**:
   - Можно выставить задержку `1 200 мс` или `2 500 мс`, чтобы тестировать лоадеры, скелетоны и защиту от повторных кликов (Rage clicks).
2. **Симуляция серверных сбоев (Chaos Engineering)**:
   - Принудительное включение ошибок `HTTP 500 Internal Server Error` или `HTTP 503 Service Unavailable`, чтобы проверить, как UI сообщает об ошибках пользователю.
3. **Мгновенный сброс базы данных**:
   - Кнопка «Сбросить БД к началу» вызывает эндпоинт `POST /api/v1/qa/reset`, очищает таблицы и повторно засевает PostgreSQL начальными данными.

---

## 📋 Остановка и перезапуск

- **Остановить контейнеры**:
  ```bash
  docker compose down
  ```
- **Остановить с полной очисткой данных БД (volumes)**:
  ```bash
  docker compose down -v
  ```

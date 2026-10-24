# 🐘 Практический SQL для QA-инженера (База данных нашего магазина)

Добро пожаловать в модуль практического изучения SQL для тестировщиков! Все примеры и задачи в этой папке написаны для **реальной базы данных `qashop` (PostgreSQL 16)**, развернутой в нашем проекте [`demo-shop/`](../demo-shop/).

---

## 🗺️ Схема базы данных `qashop`

Наша база данных содержит 5 ключевых таблиц, созданных через TypeORM:

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│           products              │           │          cart_items             │
├─────────────────────────────────┤           ├─────────────────────────────────┤
│ id           SERIAL PRIMARY KEY │ ◄──────┐  │ id           SERIAL PRIMARY KEY │
│ title        VARCHAR(255)       │        └──│ productId    INTEGER            │
│ category     VARCHAR(100)       │           │ quantity     INTEGER            │
│ price        INTEGER            │           └─────────────────────────────────┘
│ rating       FLOAT              │
│ reviewsCount INTEGER            │           ┌─────────────────────────────────┐
│ stock        INTEGER            │           │             orders              │
│ description  TEXT               │           ├─────────────────────────────────┤
│ imageUrl     VARCHAR(500)       │           │ id              VARCHAR PRIMARY │
└─────────────────────────────────┘           │ customerName    VARCHAR         │
                                              │ customerEmail   VARCHAR         │
┌─────────────────────────────────┐           │ customerPhone   VARCHAR         │
│             users               │           │ customerAddress TEXT            │
├─────────────────────────────────┤           │ paymentMethod   VARCHAR         │
│ id           SERIAL PRIMARY KEY │           │ itemsJson       JSON            │
│ name         VARCHAR(255)       │           │ subtotal        INTEGER         │
│ email        VARCHAR(255) UNIQUE│           │ discount        INTEGER         │
│ password     VARCHAR(255)       │           │ shipping        INTEGER         │
│ role         VARCHAR(50)        │           │ total           INTEGER         │
└─────────────────────────────────┘           │ status          VARCHAR         │
                                              │ createdAt       TIMESTAMP       │
                                              └─────────────────────────────────┘
```

---

## 🔌 Как подключиться к базе данных магазина

### Вариант 1: Через GUI клиент (DBeaver / DataGrip / pgAdmin)
1. Скачайте бесплатный [DBeaver Community](https://dbeaver.io/) или используйте DataGrip.
2. Создайте новое подключение ➔ выберите **PostgreSQL**.
3. Введите параметры подключения:
   - **Host**: `localhost`
   - **Port**: `5432`
   - **Database**: `qashop`
   - **Username**: `postgres`
   - **Password**: `postgres`
4. Нажмите *Test Connection* ➔ *Finish*.

### Вариант 2: Через консоль Docker контейнера
Если у вас запущен Docker, подключитесь прямо в терминале:
```bash
docker exec -it qa-shop-postgres psql -U postgres -d qashop
```

---

## 📚 Структура учебных материалов

| Файл | Тема | Чему научитесь |
| :--- | :--- | :--- |
| [**01-basic-queries.sql**](01-basic-queries.sql) | Базовые выборки и фильтрация | `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `LIKE/ILIKE`, `IN`, `BETWEEN`, `NULL` |
| [**02-aggregates-and-grouping.sql**](02-aggregates-and-grouping.sql) | Агрегации и аналитика | `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING` |
| [**03-joins-and-relations.sql**](03-joins-and-relations.sql) | Объединение таблиц | `INNER JOIN`, `LEFT JOIN`, выявление товаров без заказов и «брошенных» корзин |
| [**04-json-queries-postgres.sql**](04-json-queries-postgres.sql) | Работа с JSON в PostgreSQL | Операторы `->`, `->>`, поиск внутри поля `orders.itemsJson`, извлечение свойств |
| [**05-data-manipulation-and-test-data.sql**](05-data-manipulation-and-test-data.sql) | Изменение данных и транзакции | `INSERT`, `UPDATE`, `DELETE`, подготовка тестовых данных, `BEGIN/ROLLBACK` |
| [**06-qa-data-integrity-checks.sql**](06-qa-data-integrity-checks.sql) | Проверка целостности данных | Поиск багов математики, отрицательных остатков, рассинхрона корзины |
| [**07-practice-tasks-with-solutions.md**](07-practice-tasks-with-solutions.md) | 15 практических задач с ответами | Интерактивные задачи (Junior ➔ Middle ➔ Senior QA) с решениями под спойлерами |

---

## 💡 Золотые правила QA при работе с базой данных

1. **Никогда не делайте `UPDATE` или `DELETE` без `WHERE`**:
   Случайное выполнение `DELETE FROM users;` уничтожит всю тестовую базу.
2. **Используйте транзакции при подготовке данных**:
   ```sql
   BEGIN;
   UPDATE products SET stock = 0 WHERE id = 1; -- Проводим тест в UI...
   ROLLBACK; -- Возвращаем как было!
   ```
3. **Сначала напишите `SELECT`, потом `UPDATE`**:
   Прежде чем обновить запись, проверьте `SELECT * FROM ... WHERE ...`, чтобы убедиться, что условие захватывает ровно те строки, которые нужно изменить.

-- ==============================================================================
-- 🐘 04. Работа с JSON / JSONB в PostgreSQL (Продвинутый уровень QA)
-- База данных: qashop (Колонка: orders.itemsJson)
-- ==============================================================================

-- В нашем магазине колонка "itemsJson" в таблице "orders" хранит массив купленных товаров:
-- [
--   { "productId": 1, "title": "SoundPro X", "price": 4990, "quantity": 1, "total": 4990 }
-- ]

-- 1. БАЗОВОЕ ИЗВЛЕЧЕНИЕ СВОЙСТВ ИЗ JSON
-- Оператор ->  возвращает результат как JSON
-- Оператор ->> возвращает результат как обычный ТЕКСТ (TEXT)

-- Получить первый товар из массива itemsJson для каждого заказа:
SELECT 
    id AS order_id,
    "itemsJson" -> 0 AS first_item_raw_json,
    ("itemsJson" -> 0) ->> 'title' AS first_item_title,
    (("itemsJson" -> 0) ->> 'price')::numeric AS first_item_price
FROM orders;


-- 2. РАЗВОРАЧИВАНИЕ JSON-МАССИВА В СТРОКИ (json_array_elements)
-- Самый мощный прием в PostgreSQL: превращает массив JSON в обычные строки таблицы!
SELECT 
    o.id AS order_id,
    o."customerName",
    o."createdAt",
    item ->> 'productId' AS product_id,
    item ->> 'title' AS product_title,
    (item ->> 'price')::numeric AS unit_price,
    (item ->> 'quantity')::int AS purchased_quantity,
    (item ->> 'total')::numeric AS line_total
FROM orders o,
json_array_elements(o."itemsJson") AS item;


-- 3. ПОИСК ЗАКАЗОВ, СОДЕРЖАЩИХ ОПРЕДЕЛЕННЫЙ ТОВАР
-- Сценарий QA: Найти все заказы, в которых покупали товар с productId = 1 (Наушники SoundPro X)
SELECT DISTINCT 
    o.id AS order_id,
    o."customerName",
    o."customerEmail",
    o.total
FROM orders o,
json_array_elements(o."itemsJson") AS item
WHERE (item ->> 'productId')::int = 1;


-- 4. ПОДСЧЕТ САМЫХ ПОПУЛЯРНЫХ ТОВАРОВ ИЗ JSON-ЗАКАЗОВ
-- Аналитический запрос: топ продаваемых товаров по фактическим заказам
SELECT 
    item ->> 'title' AS product_title,
    SUM((item ->> 'quantity')::int) AS total_sold_quantity,
    SUM((item ->> 'total')::numeric) AS total_sales_revenue
FROM orders o,
json_array_elements(o."itemsJson") AS item
GROUP BY item ->> 'title'
ORDER BY total_sold_quantity DESC;


-- 5. QA-ПРОВЕРКА ВАЛИДНОСТИ JSON ПРИ ОФОРМЛЕНИИ
-- Сценарий QA: Проверить, нет ли в базе заказов с нулевой ценой или пустым названием внутри JSON:
SELECT 
    o.id AS order_id,
    item ->> 'title' AS suspicious_title,
    (item ->> 'price')::numeric AS suspicious_price
FROM orders o,
json_array_elements(o."itemsJson") AS item
WHERE (item ->> 'price')::numeric <= 0 
   OR item ->> 'title' IS NULL 
   OR item ->> 'title' = '';

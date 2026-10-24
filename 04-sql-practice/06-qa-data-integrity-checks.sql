-- ==============================================================================
-- 🐘 06. Набор SQL-скриптов для проверки целостности данных (Data Integrity Checks)
-- База данных: qashop (PostgreSQL)
-- ==============================================================================
-- Запускайте эти скрипты для поиска скрытых дефектов, которые не видны через UI!

-- 🔍 ПРОВЕРКА 1: Финансовая целостность заказов (Математический баг)
-- Формула: total = subtotal - discount + shipping
-- Этот запрос находит все заказы, где итоговая сумма рассчитана неверно!
SELECT 
    id AS corrupted_order_id,
    subtotal,
    discount,
    shipping,
    total AS recorded_total,
    (subtotal - discount + shipping) AS expected_total,
    (total - (subtotal - discount + shipping)) AS discrepancy_amount
FROM orders
WHERE total != (subtotal - discount + shipping);


-- 🔍 ПРОВЕРКА 2: Отрицательные складские остатки (Складской баг / Race Condition)
-- Товар не может иметь отрицательный остаток! Если такой есть — произошла гонка запросов.
SELECT 
    id AS product_id,
    title,
    stock AS negative_stock
FROM products
WHERE stock < 0;


-- 🔍 ПРОВЕРКА 3: Товары с подозрительно низкой или отрицательной ценой
-- Находит опечатки контент-менеджеров или сбои парсинга (цена 0 руб или < 0)
SELECT 
    id, 
    title, 
    price, 
    category
FROM products
WHERE price <= 0;


-- 🔍 ПРОВЕРКА 4: Заказы с некорректным форматом Email
-- Находит баги фронтенд-валидации, когда в базу просочились кривые почтовые адреса
SELECT 
    id AS order_id,
    "customerName",
    "customerEmail" AS invalid_email
FROM orders
WHERE "customerEmail" NOT LIKE '%_@__%.__%'
   OR "customerEmail" LIKE '% %' -- пробелы внутри email
   OR "customerEmail" IS NULL;


-- 🔍 ПРОВЕРКА 5: Поиск дубликатов Email в таблице пользователей
-- Если уникальный индекс в БД не настроен, пользователи могут создать 2 аккаунта на одну почту
SELECT 
    LOWER(email) AS normalized_email,
    COUNT(*) AS duplicates_count,
    ARRAY_AGG(id) AS user_ids_list
FROM users
GROUP BY LOWER(email)
HAVING COUNT(*) > 1;


-- 🔍 ПРОВЕРКА 6: Пустые заказы (Заказы без товаров в JSON)
-- Находит заказы, где массив товаров пуст []
SELECT 
    id AS empty_order_id,
    "customerName",
    "createdAt",
    "itemsJson"
FROM orders
WHERE "itemsJson" IS NULL 
   OR json_array_length("itemsJson") = 0;


-- 🔍 ПРОВЕРКА 7: Заказы с отрицательными скидками или аномальной стоимостью доставки
SELECT 
    id,
    "customerName",
    discount,
    shipping
FROM orders
WHERE discount < 0 OR shipping < 0;


-- 🔍 ПРОВЕРКА 8: Сравнение цены в чеке с текущей ценой каталога
-- Позволяет провести аудит: изменилась ли цена товара после того, как его купили
SELECT 
    o.id AS order_id,
    item ->> 'title' AS product_name,
    (item ->> 'price')::numeric AS price_at_purchase,
    p.price AS current_catalog_price,
    ((item ->> 'price')::numeric - p.price) AS price_difference
FROM orders o,
json_array_elements(o."itemsJson") AS item
JOIN products p ON (item ->> 'productId')::int = p.id
WHERE (item ->> 'price')::numeric != p.price;

-- ==============================================================================
-- 🐘 02. Агрегатные функции и группировка (COUNT, SUM, AVG, GROUP BY, HAVING)
-- База данных: qashop (PostgreSQL)
-- ==============================================================================

-- 1. БАЗОВЫЕ АГРЕГАТНЫЕ ФУНКЦИИ
-- Посчитать общее количество товаров в каталоге
SELECT COUNT(*) AS total_products FROM products;

-- Разница между COUNT(*) и COUNT(column):
-- COUNT(*) считает все строки, а COUNT(column) игнорирует NULL-значения!
SELECT 
    COUNT(*) AS total_rows,
    COUNT(description) AS rows_with_description,
    COUNT(DISTINCT category) AS unique_categories_count
FROM products;

-- Минимальная, максимальная и средняя цена товаров в магазине
SELECT 
    MIN(price) AS min_price,
    MAX(price) AS max_price,
    ROUND(AVG(price)::numeric, 2) AS average_price,
    SUM(price * stock) AS total_warehouse_value -- Общая стоимость всех товаров на складе
FROM products;


-- 2. ГРУППИРОВКА ПО КАТЕГОРИЯМ (GROUP BY)
-- Посчитать количество товаров, среднюю цену и общий остаток по каждой категории
SELECT 
    category,
    COUNT(*) AS products_in_category,
    MIN(price) AS min_price,
    MAX(price) AS max_price,
    ROUND(AVG(price)::numeric, 2) AS avg_price,
    SUM(stock) AS total_stock
FROM products
GROUP BY category
ORDER BY products_in_category DESC;


-- 3. ФИЛЬТРАЦИЯ СГРУППИРОВАННЫХ ДАННЫХ (HAVING)
-- ВАЖНОЕ ПРАВИЛО ДЛЯ СОБЕСЕДОВАНИЙ:
-- WHERE фильтрует СТРОКИ ДО группировки.
-- HAVING фильтрует ГРУППЫ ПОСЛЕ выполнения агрегатной функции!

-- Найти категории, в которых представлено более 1 товара
SELECT 
    category, 
    COUNT(*) AS total_items
FROM products
GROUP BY category
HAVING COUNT(*) > 1;

-- Найти категории, где средняя цена товара превышает 4 000 рублей
SELECT 
    category,
    ROUND(AVG(price)::numeric, 2) AS avg_price
FROM products
GROUP BY category
HAVING AVG(price) > 4000;


-- 4. АНАЛИТИКА ЗАКАЗОВ ДЛЯ ТЕСТИРОВЩИКА
-- Статистика выручки по способам оплаты (CARD vs CASH)
SELECT 
    "paymentMethod",
    COUNT(*) AS total_orders,
    SUM(total) AS total_revenue,
    ROUND(AVG(total)::numeric, 2) AS average_order_value, -- AOV (Средний чек)
    SUM(discount) AS total_discounts_given
FROM orders
GROUP BY "paymentMethod";

-- Количество заказов по статусам (PAID, PROCESSING, DELIVERED)
SELECT 
    status,
    COUNT(*) AS orders_count,
    SUM(total) AS revenue
FROM orders
GROUP BY status;


-- 5. ГРУППИРОВКА ПО ДАТАМ (DATE_TRUNC)
-- Посчитать количество заказов и выручку по дням
SELECT 
    DATE_TRUNC('day', "createdAt")::date AS order_date,
    COUNT(*) AS orders_count,
    SUM(total) AS daily_revenue
FROM orders
GROUP BY DATE_TRUNC('day', "createdAt")::date
ORDER BY order_date DESC;

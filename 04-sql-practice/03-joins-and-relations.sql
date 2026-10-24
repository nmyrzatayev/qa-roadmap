-- ==============================================================================
-- 🐘 03. Связывание таблиц (INNER, LEFT, RIGHT, FULL JOIN и поиск аномалий)
-- База данных: qashop (PostgreSQL)
-- ==============================================================================

-- 1. INNER JOIN (ВНУТРЕННЕЕ СОЕДИНЕНИЕ)
-- Возвращает строки только тогда, когда есть совпадение в ОБЕИХ таблицах.
-- Пример: Получить товары, находящиеся в корзине, с их актуальными ценами и названиями:
SELECT 
    c.id AS cart_item_id,
    c."productId",
    p.title AS product_name,
    p.price AS unit_price,
    c.quantity,
    (p.price * c.quantity) AS item_subtotal,
    p.stock AS available_stock
FROM cart_items c
INNER JOIN products p ON c."productId" = p.id;


-- 2. LEFT JOIN (ЛЕВОЕ ВНЕШНЕЕ СОЕДИНЕНИЕ)
-- Возвращает ВСЕ строки из левой таблицы и совпавшие из правой. 
-- Если в правой таблице совпадений нет — в ее колонках будет NULL.

-- Сценарий QA №1: Найти товары из каталога, которые СЕЙЧАС НИКТО НЕ ДОБАВИЛ В КОРЗИНУ
SELECT 
    p.id AS product_id,
    p.title,
    p.category,
    p.price
FROM products p
LEFT JOIN cart_items c ON p.id = c."productId"
WHERE c.id IS NULL;


-- 3. ПОИСК АНОМАЛИЙ И НАРУШЕНИЙ ЦЕЛОСТНОСТИ ДАННЫХ (Data Integrity Bug)
-- Сценарий QA №2: «Битые записи в корзине» (Orphaned Records)
-- Представьте, что товар удалили из каталога, но запись в корзине у покупателя осталась.
-- Такой LEFT JOIN мгновенно находит этот дефект:
SELECT 
    c.id AS cart_item_id,
    c."productId" AS invalid_product_id,
    c.quantity
FROM cart_items c
LEFT JOIN products p ON c."productId" = p.id
WHERE p.id IS NULL;


-- 4. СРАВНЕНИЕ ДАННЫХ В КОРЗИНЕ С РЕАЛЬНЫМ ОСТАТКОМ НА СКЛАДЕ
-- Сценарий QA №3: Проверка на превышение складского остатка
-- Находит ситуации, когда в корзине запрошено больше товара, чем физически есть на складе
SELECT 
    c.id AS cart_item_id,
    p.title,
    c.quantity AS in_cart_qty,
    p.stock AS warehouse_stock,
    (c.quantity - p.stock) AS overstock_amount
FROM cart_items c
INNER JOIN products p ON c."productId" = p.id
WHERE c.quantity > p.stock;


-- 5. МНОЖЕСТВЕННЫЙ JOIN (ПРИМЕР СО СВЯЗЯМИ 3-Х ТАБЛИЦ)
-- Проверка заказов, пользователей и прав доступа
SELECT 
    o.id AS order_id,
    o."createdAt",
    o."customerName",
    o.total,
    u.id AS registered_user_id,
    u.email AS user_email,
    u.role AS user_role
FROM orders o
LEFT JOIN users u ON LOWER(o."customerEmail") = LOWER(u.email);


-- 6. FULL OUTER JOIN
-- Показывает ВСЕ строки из обеих таблиц, объединяя их по ключу, заполняя пропуски NULL
SELECT 
    p.id AS product_id,
    p.title,
    c.id AS cart_id,
    c.quantity
FROM products p
FULL OUTER JOIN cart_items c ON p.id = c."productId";

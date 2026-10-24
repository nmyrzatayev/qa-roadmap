-- ==============================================================================
-- 🐘 01. Базовые SQL-запросы (SELECT, Фильтрация, Сортировка и Пагинация)
-- База данных: qashop (PostgreSQL)
-- ==============================================================================

-- 1. ПРОСТОЙ ВЫБОР ВСЕХ ДАННЫХ
-- Получить все колонки и строки из таблицы товаров
SELECT * FROM products;

-- Получить только конкретные колонки с псевдонимами (алиасами) для читаемости
SELECT 
    id AS product_id,
    title AS product_name,
    price,
    stock AS items_in_stock
FROM products;

-- Получить уникальные категории товаров (без дубликатов)
SELECT DISTINCT category FROM products;


-- 2. ФИЛЬТРАЦИЯ ДАННЫХ (WHERE)
-- Поиск товаров, которых нет в наличии (stock = 0)
-- Отличный тест для проверки отображения плашки «Распродано» в UI!
SELECT id, title, price, stock 
FROM products 
WHERE stock = 0;

-- Поиск товаров в ценовом диапазоне от 3 000 до 8 000 рублей
SELECT id, title, price, category 
FROM products 
WHERE price BETWEEN 3000 AND 8000;

-- Фильтрация по нескольким категориям (оператор IN)
SELECT id, title, category, price 
FROM products 
WHERE category IN ('Электроника', 'Аксессуары');

-- Комбинированные логические условия (AND, OR, NOT)
-- Ищем товары категории "Электроника" с ценой выше 5000 рублей И остатком больше 0
SELECT id, title, category, price, stock 
FROM products 
WHERE category = 'Электроника' 
  AND price > 5000 
  AND stock > 0;


-- 3. ПОИСК ПО ТЕКСТОВЫМ ШАБЛОНАМ (LIKE и ILIKE)
-- В PostgreSQL оператор LIKE чувствителен к регистру, а ILIKE — регистронезависимый!
-- Поиск товаров, в названии которых есть слово "наушники" в любом регистре
SELECT id, title, description 
FROM products 
WHERE title ILIKE '%наушники%';

-- Поиск пользователей с почтой на Gmail
SELECT id, name, email 
FROM users 
WHERE email LIKE '%@gmail.com';

-- Поиск заказов с кодом, начинающимся на ORD-
SELECT id, "customerName", total, status 
FROM orders 
WHERE id LIKE 'ORD-%';


-- 4. РАБОТА С NULL-ЗНАЧЕНИЯМИ (ПУСТЫМИ ЗНАЧЕНИЯМИ)
-- Проверка товаров без описания или картинки
SELECT id, title, description, "imageUrl" 
FROM products 
WHERE description IS NULL OR "imageUrl" IS NULL;

-- Функция COALESCE: возвращает первое не-NULL значение (удобно для подстановки дефолтов)
SELECT 
    id, 
    title, 
    COALESCE(description, 'Описание отсутствует') AS clean_description 
FROM products;


-- 5. СОРТИРОВКА (ORDER BY)
-- Сортировка по цене: сначала самые дорогие (по убыванию - DESC)
SELECT id, title, price, rating 
FROM products 
ORDER BY price DESC;

-- Множественная сортировка: сначала по категории (A-Z), внутри категории — по рейтингу (DESC)
SELECT category, title, price, rating 
FROM products 
ORDER BY category ASC, rating DESC;


-- 6. ПАГИНАЦИЯ ДАННЫХ (LIMIT и OFFSET)
-- Реализация страницы №1 при лимите 4 товара на страницу
SELECT id, title, price 
FROM products 
ORDER BY id ASC 
LIMIT 4 OFFSET 0;

-- Реализация страницы №2 (пропускаем первые 4, берем следующие 4)
SELECT id, title, price 
FROM products 
ORDER BY id ASC 
LIMIT 4 OFFSET 4;

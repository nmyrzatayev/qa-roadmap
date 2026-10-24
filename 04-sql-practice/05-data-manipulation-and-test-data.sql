-- ==============================================================================
-- 🐘 05. Модификация данных и подготовка тестового стенда (INSERT, UPDATE, DELETE, ТРАНЗАКЦИИ)
-- База данных: qashop (PostgreSQL)
-- ==============================================================================

-- 1. ДОБАВЛЕНИЕ ТЕСТОВЫХ ДАННЫХ (INSERT)
-- Добавить один тестовый товар для проверки верстки длинных названий
INSERT INTO products (title, category, price, stock, description, "imageUrl", rating, "reviewsCount")
VALUES (
    'Тестовый супер-длинный товар для проверки переполнения блока в интерфейсе каталога магазина 2026',
    'Электроника',
    99990,
    10,
    'Описание для стресс-тестирования переполнения текста в карточке товара...',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    4.9,
    15
)
RETURNING id, title; -- Ключевое слово RETURNING возвращает созданный ID сразу!

-- Массовая вставка нескольких пользователей для нагрузочного тестирования
INSERT INTO users (name, email, password, role)
VALUES 
    ('Тестер Иван', 'ivan.tester@qa.com', 'testpass1', 'user'),
    ('Тестер Анна', 'anna.tester@qa.com', 'testpass2', 'user'),
    ('Менеджер QA', 'manager.qa@qa.com', 'adminpass', 'admin');


-- 2. ОБНОВЛЕНИЕ ДАННЫХ (UPDATE)
-- ⚠️ ВНИМАНИЕ: Всегда используйте условие WHERE!

-- Сценарий QA №1: Быстро обнулить остаток товара ID 1, чтобы протестировать реакцию UI
UPDATE products
SET stock = 0
WHERE id = 1;

-- Сценарий QA №2: Сделать сезонную скидку 10% на все товары категории 'Книги'
UPDATE products
SET price = ROUND(price * 0.9)
WHERE category = 'Книги';

-- Сценарий QA №3: Перевести заказ из статуса PAID в DELIVERED
UPDATE orders
SET status = 'DELIVERED'
WHERE id = 'ORD-123456';


-- 3. БЕЗОПАСНАЯ РАБОТА С ТРАНЗАКЦИЯМИ (BEGIN / ROLLBACK / COMMIT)
-- Золотое правило профессионального тестировщика:
-- Если вам нужно протестировать модификацию данных, но не сломать тестовый стенд коллегам —
-- оборачивайте команды в транзакцию с последующим ROLLBACK!

BEGIN; -- Начинаем транзакцию

    -- Меняем цены на все товары в 10 раз
    UPDATE products SET price = price * 10;
    
    -- Проверяем результат внутри транзакции
    SELECT id, title, price FROM products LIMIT 3;

ROLLBACK; -- Откатываем все изменения назад! База осталась нетронутой.

-- Проверяем, что цены вернулись к исходным
SELECT id, title, price FROM products LIMIT 3;


-- 4. УДАЛЕНИЕ ДАННЫХ (DELETE)
-- Удалить тестовые заказы, созданные автотестами
DELETE FROM orders
WHERE "customerEmail" LIKE '%@qa-auto.com';

-- Полная очистка корзины покупателя
DELETE FROM cart_items;

-- Разница между DELETE и TRUNCATE:
-- DELETE построчно удаляет данные и записывает это в лог (медленнее, можно с WHERE).
-- TRUNCATE мгновенно очищает всю таблицу и сбрасывает счетчики SERIAL (быстрее, нельзя с WHERE).
-- TRUNCATE TABLE cart_items;

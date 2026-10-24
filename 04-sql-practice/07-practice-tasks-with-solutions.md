# 📝 15 Практических задач по SQL для QA-инженера (с ответами)

> **Как проходить практику**: Сначала попробуйте написать запрос самостоятельно в DBeaver или консоли `psql`, проверьте результат на базе `qashop`, и только затем открывайте спойлер с решением.

---

## 🟢 Уровень 1: Junior QA (Базовая выборка, фильтрация, сортировка)

### Задача 1: Поиск распроданных товаров
**Контекст**: Тестировщик проверяет, как в UI отображаются товары, которых нет в наличии.  
**Задание**: Напишите запрос, который возвращает `id`, `title` и `price` всех товаров из таблицы `products`, у которых остаток (`stock`) равен нулю.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT id, title, price 
FROM products 
WHERE stock = 0;
```
</details>

---

### Задача 2: Дорогая электроника
**Контекст**: Бизнес попросил проверить выдачу товаров в премиум-сегменте.  
**Задание**: Выбрать все товары категории `'Электроника'` с ценой от `5 000` рублей включительно, отсортированные от самых дорогих к более дешевым.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT id, title, category, price 
FROM products 
WHERE category = 'Электроника' AND price >= 5000 
ORDER BY price DESC;
```
</details>

---

### Задача 3: Поиск по части названия
**Контекст**: Проверяем логику строки поиска каталога.  
**Задание**: Найти все товары, в названии которых встречается слово «мышь» или «клавиатура» без учета регистра (регистронезависимо).

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT id, title, category, price 
FROM products 
WHERE title ILIKE '%мышь%' OR title ILIKE '%клавиатура%';
```
*💡 Примечание: В PostgreSQL оператор `ILIKE` не чувствителен к регистру (в отличие от стандартного `LIKE`).*
</details>

---

### Задача 4: Топ-3 самых популярных товара
**Контекст**: На главной странице должен отображаться блок «Лидеры по отзывам».  
**Задание**: Вывести первые 3 товара с наибольшим количеством отзывов (`reviewsCount`).

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT id, title, rating, "reviewsCount" 
FROM products 
ORDER BY "reviewsCount" DESC 
LIMIT 3;
```
</details>

---

### Задача 5: Пользователи с правами администратора
**Контекст**: Аудит безопасности учетных записей.  
**Задание**: Вывести имена и email всех пользователей с ролью `'admin'`.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT id, name, email, role 
FROM users 
WHERE role = 'admin';
```
</details>

---

## 🟡 Уровень 2: Middle QA (Агрегации, группировки и JOIN)

### Задача 6: Общее количество и средний чек заказов
**Контекст**: Проверка финансовых отчетов в админке.  
**Задание**: Посчитать общее количество оформленных заказов, сумму всей выручки (`total`) и средний чек покупки, округленный до 2 знаков.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT 
    COUNT(*) AS total_orders,
    SUM(total) AS total_revenue,
    ROUND(AVG(total)::numeric, 2) AS average_check
FROM orders;
```
</details>

---

### Задача 7: Количество товаров по категориям
**Контекст**: Проверка счетчиков в боковом меню категорий.  
**Задание**: Вывести список категорий и количество активных товаров в каждой из них, отсортированный по убыванию количества.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT 
    category, 
    COUNT(*) AS products_count 
FROM products 
GROUP BY category 
ORDER BY products_count DESC;
```
</details>

---

### Задача 8: Категории со средней ценой выше 4 000 ₽ (HAVING)
**Контекст**: Анализ ценового позиционирования отделов магазина.  
**Задание**: Вывести категории, в которых средняя цена товара строго больше `4 000` рублей.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT 
    category, 
    ROUND(AVG(price)::numeric, 2) AS avg_price 
FROM products 
GROUP BY category 
HAVING AVG(price) > 4000;
```
*💡 Разница: `WHERE` отфильтровал бы товары ДО расчета среднего, а `HAVING` фильтрует группы ПОСЛЕ подсчета.*
</details>

---

### Задача 9: Проверка содержимого корзины (INNER JOIN)
**Контекст**: Валидация расчета суммы в корзине пользователя.  
**Задание**: Объединить таблицы `cart_items` и `products`, вывести название товара, цену за штуку, количество в корзине и промежуточную стоимость позиции (`price * quantity`).

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT 
    c.id AS cart_item_id,
    p.title,
    p.price,
    c.quantity,
    (p.price * c.quantity) AS item_total
FROM cart_items c
INNER JOIN products p ON c."productId" = p.id;
```
</details>

---

### Задача 10: Поиск «непопулярных» товаров (LEFT JOIN)
**Контекст**: Маркетологи хотят узнать, какие товары прямо сейчас никто не положил в корзину.  
**Задание**: Найти товары из каталога, которых нет ни в одной корзине (в `cart_items`).

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT 
    p.id, 
    p.title, 
    p.category, 
    p.price 
FROM products p
LEFT JOIN cart_items c ON p.id = c."productId"
WHERE c.id IS NULL;
```
</details>

---

## 🔴 Уровень 3: Senior / Lead QA (JSON, аудит данных, транзакции)

### Задача 11: Поиск заказов, содержащих конкретный товар из JSON
**Контекст**: Покупатель обратился с претензией по поводу «Наушников SoundPro X» (productId: 1).  
**Задание**: Найти все заказы, в составе которых (`itemsJson`) присутствует товар с `productId = 1`.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT DISTINCT 
    o.id AS order_id,
    o."customerName",
    o."customerEmail",
    o.total,
    o."createdAt"
FROM orders o,
json_array_elements(o."itemsJson") AS item
WHERE (item ->> 'productId')::int = 1;
```
</details>

---

### Задача 12: Финансовый аудит формулы чекаута (Поиск багов)
**Контекст**: Выявление дефектов в логике применения скидок и доставки на бэкенде.  
**Задание**: Найти заказы, где поле `total` НЕ РАВНО формуле `subtotal - discount + shipping`.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT 
    id, 
    subtotal, 
    discount, 
    shipping, 
    total AS recorded_total, 
    (subtotal - discount + shipping) AS expected_total,
    (total - (subtotal - discount + shipping)) AS discrepancy
FROM orders 
WHERE total != (subtotal - discount + shipping);
```
</details>

---

### Задача 13: Самый продаваемый товар за все время
**Контекст**: Проверка формирования годового отчета продаж.  
**Задание**: Развернуть JSON-массивы всех заказов и посчитать суммарное количество проданных штук по каждому товару.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT 
    item ->> 'title' AS product_name,
    SUM((item ->> 'quantity')::int) AS total_sold_qty,
    SUM((item ->> 'total')::numeric) AS revenue_generated
FROM orders o,
json_array_elements(o."itemsJson") AS item
GROUP BY item ->> 'title'
ORDER BY total_sold_qty DESC;
```
</details>

---

### Задача 14: Безопасное тестирование скидок через транзакцию
**Контекст**: Тестировщику нужно временно сделать цену товара ID 2 равной 10 рублям для проверки оплаты через реальный шлюз, а затем вернуть прежнюю цену.  
**Задание**: Напишите транзакцию с откатом изменений (`ROLLBACK`).

<details>
<summary>👀 Показать решение</summary>

```sql
BEGIN;

-- Временно меняем цену
UPDATE products SET price = 10 WHERE id = 2;

-- Проверяем результат
SELECT id, title, price FROM products WHERE id = 2;

-- Откатываем обратно
ROLLBACK;

-- Убеждаемся, что старая цена восстановилась
SELECT id, title, price FROM products WHERE id = 2;
```
</details>

---

### Задача 15: Поиск «битых» записей в корзине (Orphaned check)
**Контекст**: Проверка каскадного удаления и ссылочной целостности (Foreign Keys).  
**Задание**: Найти строки в `cart_items`, которые ссылаются на несуществующий `productId` в таблице `products`.

<details>
<summary>👀 Показать решение</summary>

```sql
SELECT 
    c.id AS broken_cart_item_id,
    c."productId" AS missing_product_id,
    c.quantity
FROM cart_items c
LEFT JOIN products p ON c."productId" = p.id
WHERE p.id IS NULL;
```
</details>

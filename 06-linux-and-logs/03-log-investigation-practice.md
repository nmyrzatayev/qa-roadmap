# 🕵️ Практикум расследования инцидентов по серверным логам

> Когда пользователь видит в интерфейсе сообщение *«Что-то пошло не так (500)»*, плохой тестировщик пишет в баг-репорте: *«Красная плашка на фронте»*. Хороший тестировщик идет в логи бэкенда, находит точный файл, номер строки и причину падения (StackTrace), прикрепляя их к задаче.

---

## 🧭 Универсальный алгоритм расследования инцидента по логам

```
1. Зафиксировать точное время (Timestamp) воспроизведения бага в браузере (чч:мм:сс).
2. Подключиться к контейнеру / серверу и открыть лог: tail -f app.log или docker logs.
3. Повторить действие на клиенте.
4. Локализовать блок ошибки: искать ключевые слова ERROR, FATAL, Exception, StackTrace.
5. Найти «Root Cause» (первопричину) — самая глубокая строка в блоке Caused by: ...
6. Скопировать лог и прикрепить к баг-репорту с указанием файла и строки кода.
```

---

## 🔍 Инцидент 1: Необработанное исключение (Cannot read property of undefined)

### Лог бэкенда:
```text
2026-11-24T10:15:32.412Z [INFO] incoming request: POST /api/v1/orders/checkout
2026-11-24T10:15:32.415Z [INFO] customer data received: {"name":"Alex","phone":"+79991234567"}
2026-11-24T10:15:32.420Z [ERROR] Unhandled error during order checkout!
TypeError: Cannot read properties of undefined (reading 'toLowerCase')
    at validateCustomer (c:\projects\qa-roadmap\demo-shop\backend\src\services\orderService.js:42:25)
    at createOrder (c:\projects\qa-roadmap\demo-shop\backend\src\services\orderService.js:89:12)
    at async c:\projects\qa-roadmap\demo-shop\backend\src\routes\orders.js:54:19
2026-11-24T10:15:32.425Z [INFO] Response status: 500 Internal Server Error
```

### Анализ тестировщика:
1. **Эндпоинт:** `POST /api/v1/orders/checkout`.
2. **Тип ошибки:** `TypeError: Cannot read properties of undefined (reading 'toLowerCase')`.
3. **Место сбоя:** файл `orderService.js`, строка `42`, колонка `25`.
4. **Причина:** в теле запроса переданы `name` и `phone`, но **не передано поле `email`**! В коде разработчик попытался вызвать `customer.email.toLowerCase()`, не сделав проверку на существование поля (`customer.email?.toLowerCase()`).
5. **Вердикт для баг-репорта:** Отсутствие валидации обязательного поля `email` на уровне роута приводит к падению Node.js с кодом 500 вместо возврата `400 Bad Request: "Поле email обязательно"`.

---

## 🔍 Инцидент 2: Падение соединения с базой данных (Connection Pool Exhausted)

### Лог бэкенда:
```text
2026-11-24T11:02:15.105Z [WARN] DB pool active connections: 20/20. Queue size: 45
2026-11-24T11:02:25.110Z [ERROR] QueryFailedError: timeout exceeded when trying to connect
    at Driver.connect (node_modules/typeorm/driver/postgres/PostgresDriver.js:290:17)
    at async DataSource.createQueryRunner (node_modules/typeorm/data-source/DataSource.js:210:13)
    at async ProductService.getAll (c:\projects\qa-roadmap\demo-shop\backend\src\services\productService.js:15:20)
2026-11-24T11:02:25.115Z [INFO] GET /api/v1/products - 504 Gateway Timeout (10005ms)
```

### Анализ тестировщика:
1. **Симптом:** Страница каталога грузится 10 секунд и падает с ошибкой `504 Gateway Timeout`.
2. **Причина из лога:** `DB pool active connections: 20/20`. Пул соединений PostgreSQL исчерпан (все 20 соединений заняты). Новые запросы встают в очередь и отваливаются по 10-секундному таймауту.
3. **Что проверять QA:**
   - Либо произошла утечка соединений (разработчик забыл закрыть транзакцию или `queryRunner.release()`).
   - Либо выполняется «тяжелый» неоптимизированный SQL-запрос (например, `SELECT *` без индекса и `LIMIT`), блокирующий подключение надолго.

---

## 🔍 Инцидент 3: Утечка памяти (Out of Memory / JavaScript heap out of memory)

### Лог контейнера:
```text
<--- Last few GCs --->
[1:0x55d89f20]    85240 ms: Mark-sweep 2045.2 (2052.1) -> 2043.1 (2052.1) MB, 1200.5 / 0.0 ms (average mu = 0.124, current mu = 0.021) allocation failure scavenge might not succeed
[1:0x55d89f20]    86645 ms: Mark-sweep 2044.8 (2052.1) -> 2044.2 (2052.1) MB, 1405.0 / 0.0 ms (average mu = 0.065, current mu = 0.005) allocation failure scavenge might not succeed

<--- JS stacktrace --->
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
 1: 0xb7b420 node::Abort() [node]
 2: 0xa8715b  [node]
 3: 0xd3e512 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [node]
```

### Анализ тестировщика:
1. **Симптом:** Контейнер бэкенда внезапно перезагружается (`docker ps` показывает статус `Restarting` или `Exited (137)`).
2. **Причина:** Процесс Node.js превысил лимит выделенной оперативной памяти (~2 ГБ) из-за утечки памяти (Memory Leak) или загрузки огромного массива данных целиком в оперативную память (например, экспорт 1 000 000 заказов без стриминга/пагинации).
3. **Как локализовать:** Проверить, какие запросы выполнялись непосредственно перед крашем: `grep -B 10 "JavaScript heap out of memory" app.log`.

---

## 🎯 Задачи для самопроверки

Попробуйте ответить на вопросы:
1. *Пользователь пожаловался, что в 14:35 не смог авторизоваться. Какой командой `grep` вы найдете события в логе `access.log` за этот период?*  
   👉 **Ответ:** `grep "24/Nov/2026:14:35" access.log | grep "/api/v1/auth/login"`
2. *Как отфильтровать только уникальные URL, к которым обращались клиенты с ошибкой 404?*  
   👉 **Ответ:** `grep " 404 " access.log | awk '{print $7}' | sort | uniq`
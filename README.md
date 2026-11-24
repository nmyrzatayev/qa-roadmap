# 🚀 QA Engineering Roadmap & Knowledge Hub

> **Комплексная Open Source база знаний, интерактивная практическая платформа и тренажер для QA-инженеров любого уровня: от фундаментальной теории и тест-дизайна до продуктового мышления, автоматизации, работы с базами данных, Linux, сетями и безопасностью.**

---

## 🧭 Навигация по материалам

### 📍 Раздел 1: Базовая дорожная карта начинающего QA ([01-roadmap/](01-roadmap/))
Пошаговый трек для старта в профессии, выстроенный в логической последовательности:
1. [**01. Основы и теория тестирования**](01-roadmap/01-basics-and-theory.md) — 7 принципов ISTQB, цели QA/QC, уровни, типы тестирования и техники тест-дизайна с наглядными примерами.
2. [**02. Процессы разработки и артефакты**](01-roadmap/02-sdlc-and-process.md) — SDLC, STLC, Agile/Scrum/Kanban, структура баг-репортов, тест-планов, чек-листов и матриц трассировки.
3. [**03. Тестирование Web и API**](01-roadmap/03-web-and-api-testing.md) — Клиент-серверная архитектура, HTTP/REST, коды ответов, DevTools (Network, Console, Application) и практическая работа с Postman.
4. [**04. Базы данных и работа с логами**](01-roadmap/04-databases-and-logs.md) — Реляционные БД, необходимый SQL для QA (SELECT, JOIN, агрегаты), чтение логов и базовая работа в терминале.
5. [**05. Особенности мобильного тестирования**](01-roadmap/05-mobile-testing.md) — iOS vs Android, прерывания, разрешения, особенности сенсорных экранов и нестабильного интернета.
6. [**06. Введение в тест-автоматизацию**](01-roadmap/06-intro-to-automation.md) — Пирамида тестирования, когда пора автоматизировать, выбор инструментов и основы CI/CD.

---

### 🧠 Раздел 2: Прогнозирование действий пользователей и Product Mindset ([02-user-behavior-and-product-mindset/](02-user-behavior-and-product-mindset/))
*Навыки, отличающие сильного QA от «проверяльщика по готовым инструкциям». Умение предвидеть, как реальный человек сломает приложение.*
1. [**01. Моделирование поведения и психология пользователя**](02-user-behavior-and-product-mindset/01-user-modeling-and-psychology.md) — Персоны, ментальные модели, когнитивная нагрузка, эффект «ленивого пользователя», типовые поведенческие паттерны и ошибки.
2. [**02. Продуктовая аналитика для тестировщика**](02-user-behavior-and-product-mindset/02-product-analytics-for-qa.md) — Воронки, тепловые карты, когорты; как логи аналитики помогают находить скрытые дефекты до жалоб в саппорт.
3. [**03. Исследовательское тестирование и эвристики**](02-user-behavior-and-product-mindset/03-exploratory-and-persona-testing.md) — Эвристика SFDIPOT, туры тестирования Джеймса Баха и Майкла Болтона, ролевое тестирование.
4. [**04. UX-эвристики и доступность (Accessibility)**](02-user-behavior-and-product-mindset/04-accessibility-and-ux-heuristics.md) — 10 эвристик юзабилити Якоба Нильсена и основы a11y (WCAG) в работе тестировщика.

---

### 📋 Раздел 3: Практические шаблоны и чек-листы ([03-templates-and-checklists/](03-templates-and-checklists/))
Готовые шаблоны проектной документации по мировым стандартам (IEEE 829):
- [**Шаблон идеального баг-репорта**](03-templates-and-checklists/bug-report-template.md)
- [**Шаблон тест-кейса и чек-листа**](03-templates-and-checklists/test-case-template.md)
- [**Шаблон тест-плана проекта (Test Plan)**](03-templates-and-checklists/test-plan-template.md)
- [**Шаблон итогового отчета о тестировании (Test Summary Report)**](03-templates-and-checklists/test-summary-report-template.md)
- [**Чек-лист «Что может пойти не так у пользователя»**](03-templates-and-checklists/user-journey-stress-checklist.md)

---

### 🎯 Раздел 4: Собеседования, карьера и резюме ([05-interview-and-career/](05-interview-and-career/))
*Подготовка к выходу на рынок труда и прохождению технического скрининга:*
- [**Топ вопросов с собеседований для QA Engineer**](05-interview-and-career/01-top-qa-interview-questions.md) — 20+ подробных разборов вопросов по теории, HTTP, SQL, Git и поведенческим кейсам (STAR).
- [**Разбор задач по тест-дизайну с интервью**](05-interview-and-career/02-test-design-cases-and-tasks.md) — Карандаш, банкомат, форма авторизации, поле возраста (18-65), таблица решений промокодов.
- [**Пример выполнения реального тестового задания**](05-interview-and-career/03-take-home-assignment-example.md) — Образцовый тест-план, чек-лист и баг-репорты.
- [**Гайд по оформлению резюме и портфолио**](05-interview-and-career/04-resume-and-portfolio-guide.md) — Как презентовать свои навыки на hh.ru / LinkedIn и обойти фильтры рекрутеров.

---

### 🐧 Раздел 5: Linux, Docker и анализ логов ([06-linux-and-logs/](06-linux-and-logs/))
*Инженерные навыки работы с сервером и расследования инцидентов:*
- [**Linux шпаргалка для QA**](06-linux-and-logs/01-linux-essentials-for-qa.md) — Навигация, `tail -f`, `grep`, `awk`, конвейеры, мониторинг памяти и сети (`curl`, `ss`).
- [**Docker для тестировщика**](06-linux-and-logs/02-docker-commands-for-qa.md) — Управление контейнерами, `docker logs`, `docker exec`, работа с Docker Compose.
- [**Практикум расследования инцидентов по логам**](06-linux-and-logs/03-log-investigation-practice.md) — Разбор реальных StackTrace: 500, DB Pool Timeout, Out of Memory.

---

### 🛰️ Раздел 6: Перехват трафика и DevTools ([07-traffic-sniffing-and-devtools/](07-traffic-sniffing-and-devtools/))
*Глубокое тестирование веб- и мобильных клиентов через подмену данных:*
- [**Chrome DevTools для QA**](07-traffic-sniffing-and-devtools/01-chrome-devtools-for-qa.md) — Network вкладка, троттлинг (Slow 3G, Offline), Local Overrides (подмена JSON на лету), Application storage, экспорт HAR.
- [**Charles Proxy & Proxyman**](07-traffic-sniffing-and-devtools/02-proxy-tools-charles-proxyman.md) — Breakpoints, Map Local, Rewrite Rules, SSL-сертификаты, подключение реального смартфона (iOS/Android).

---

### 🛡️ Раздел 7: Тестирование безопасности и OWASP Top-10 ([08-security-testing/](08-security-testing/))
*Базовая безопасность веб-приложений:*
- [**Основы OWASP Top-10 для QA**](08-security-testing/01-owasp-top-10-for-qa.md) — IDOR, Cryptographic Failures, SQLi, XSS, Brute-Force защита.
- [**Практические кейсы безопасности в магазине**](08-security-testing/02-security-test-cases-shop.md) — Эксплуатация XSS (Баг #10), манипуляция параметрами цен и SQLi проверки.

---

### 🐘 Раздел 8: Практический SQL для QA на базе магазина ([04-sql-practice/](04-sql-practice/))
*Комплекс SQL-скриптов и задач, привязанных к реальной PostgreSQL базе магазина:*
- [**01. Базовые запросы**](04-sql-practice/01-basic-queries.sql) — `SELECT`, `WHERE`, `ORDER BY`, `LIKE/ILIKE`, `BETWEEN`, `LIMIT/OFFSET`.
- [**02. Агрегации и аналитика**](04-sql-practice/02-aggregates-and-grouping.sql) — `COUNT`, `SUM`, `AVG`, `GROUP BY`, `HAVING`.
- [**03. Связи и JOIN**](04-sql-practice/03-joins-and-relations.sql) — `INNER/LEFT JOIN`, поиск битых записей корзины и товаров без заказов.
- [**04. Работа с JSON**](04-sql-practice/04-json-queries-postgres.sql) — парсинг массива `orders.itemsJson`, поиск покупок и топ продаж.
- [**05. Модификация данных и транзакции**](04-sql-practice/05-data-manipulation-and-test-data.sql) — безопасная подготовка тест-стенда с `BEGIN/ROLLBACK`.
- [**06. Проверка целостности данных**](04-sql-practice/06-qa-data-integrity-checks.sql) — скрипты поиска математических багов, отрицательных остатков и дубликатов.
- [**07. 15 практических задач с решениями**](04-sql-practice/07-practice-tasks-with-solutions.md) — интерактивные задачи для тестировщиков (Junior ➔ Senior).

---

### 🛒 Раздел 9: Интерактивный веб-тренажер — Интернет-магазин ([demo-shop/](demo-shop/))
*Полноценное fullstack-приложение:*
- **Database**: PostgreSQL 16 + TypeORM (автоматическая схема и сидинг данных).
- **Backend**: Node.js + Express + **Swagger UI** ([`http://localhost:5000/api-docs`](http://localhost:5000/api-docs)).
- **Frontend**: React + Vite ([`http://localhost:5173`](http://localhost:5173)).
- **State Machine заказов**: Журнал заказов с переключением жизненного цикла (`PAID ➔ PROCESSING ➔ SHIPPED ➔ DELIVERED ➔ CANCELLED`).
- **Postman**: Эндпоинты экспорта и готовая коллекция с автотестами ([`http://localhost:5000/api/v1/postman`](http://localhost:5000/api/v1/postman)).
- **QA Chaos Engine**: Встроенный инструмент симуляции задержек сети, серверных сбоев (500/503) и сброса БД.
- **Bug Hunter Quest**: Квест по поиску 10 реальных смоделированных дефектов (Buggy Mode).

---

### 🤖 Раздел 10: Автоматизация и Нагрузочное тестирование ([automation-tests/](automation-tests/))
- **Playwright E2E**: Сквозные UI-тесты критического пути покупки в браузере Chromium.
- **Newman CLI**: Консольный запуск Postman-коллекции с проверками assertion.
- **k6 Load Testing**: Скрипты нагрузочного тестирования каталога и корзины ([`automation-tests/load/`](automation-tests/load/)).
- **GitHub Actions CI/CD**: Автоматизированный пайплайн сборки, API-тестов и E2E тестов ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

---

## ⚡ Быстрый старт (Запуск за 1 команду)

```bash
# 1. Клонировать репозиторий
git clone https://github.com/nmyrzatayev/qa-roadmap.git
cd qa-roadmap

# 2. Запустить весь стек в Docker
docker compose up -d --build
```

* Магазин доступен по адресу: `http://localhost:5173`
* Swagger API документация: `http://localhost:5000/api-docs`
* Инструкции для Postman: `http://localhost:5000/api/v1/postman`
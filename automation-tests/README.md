# 🤖 QA Automation Test Suite (Playwright & Newman)

Комплекс автоматизированных тестов для учебного интернет-магазина:
- **E2E UI Тесты**: [Playwright](https://playwright.dev/) (проверка пользовательских сценариев в реальном браузере Chromium).
- **API Тесты**: [Newman CLI](https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/) (автоматический прогон Postman-коллекции прямо из консоли).
- **CI/CD**: Готовый workflow для GitHub Actions ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)).

---

## 🚀 Быстрый запуск тестов

### Шаг 1. Убедитесь, что магазин и бэкенд запущены
Магазин должен быть доступен по адресам:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Шаг 2. Установка зависимостей тестов
```bash
cd automation-tests
npm install
npx playwright install chromium    # загрузка браузера для тестов
```

---

## 🧪 Запуск тестовых наборов

### 1. Запуск E2E автотестов в браузере (Playwright)
```bash
# Запуск тестов в фоновом режиме (Headless)
npm run test:e2e

# Запуск в интерактивном визуальном режиме Playwright UI (Рекомендуется для обучения!)
npm run test:e2e:ui

# Запуск с видимым окном браузера (Headed)
npm run test:e2e:headed
```

### 2. Запуск API тестов Postman через консоль (Newman)
```bash
npm run test:api
```
Newman скачивает актуальную коллекцию с бэкенда (`http://localhost:5000/api/v1/postman/collection.json`) и прогоняет все проверки статус-кодов, схем и таймингов прямо в терминале.

### 3. Запуск всех тестов разом
```bash
npm run test:all
```

---

## 📋 Какие сценарии проверяют автотесты ([tests/shop-e2e.spec.js](tests/shop-e2e.spec.js)):

1. **`TC-SMOKE-01`**: Загрузка каталога, проверка видимости категорий и карточек товаров.
2. **`TC-SEARCH-02`**: Проверка дебаунса живого поиска по названию товара («наушники»).
3. **`TC-STOCK-03`**: Проверка блокировки покупки товара с нулевым остатком (бейдж «Распродано» и атрибут `disabled`).
4. **`TC-CHECKOUT-04`**: Сквозной критический путь покупателя (Happy Path):
   - Добавление товара в корзину.
   - Применение скидки 20% по промокоду `QA2026`.
   - Заполнение формы доставки.
   - Отправка заказа и проверка сгенерированного ID заказа (`ORD-XXXXXX`).
5. **`TC-QUEST-05`**: Проверка наличия 10 скрытых дефектов в квесте `Bug Hunter`.

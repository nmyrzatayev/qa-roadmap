import { test, expect } from '@playwright/test';

test.describe('🛒 QA E-Commerce Shop - E2E Тесты', () => {

  test.beforeAll(async ({ request }) => {
    // Гарантируем чистый режим работы перед E2E тестами (сброс базы данных и хаоса)
    const apiHost = process.env.API_HOST || 'http://localhost:5000';
    try {
      await request.post(`${apiHost}/api/v1/qa/reset`);
    } catch (e) {
      console.warn('⚠️ Could not reset QA state before E2E tests:', e.message);
    }
  });

  test.beforeEach(async ({ page }) => {
    // Открываем главную страницу магазина
    await page.goto('/');
    // Ждем загрузки каталога товаров
    await expect(page.locator('.product-card').first()).toBeVisible();
  });

  test('TC-SMOKE-01: Главная страница успешно загружает товары и категории', async ({ page }) => {
    // Проверяем заголовок сайта
    await expect(page.getByRole('heading', { name: 'QA Sandbox Shop' })).toBeVisible();

    // Проверяем наличие всех категорий
    await expect(page.getByRole('button', { name: 'Все' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Электроника' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Одежда' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Книги' })).toBeVisible();

    // Проверяем, что отображается минимум 4 товара
    const cards = page.locator('.product-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('TC-SEARCH-02: Живой поиск фильтрует каталог по ключевому слову', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Поиск товаров/i);
    await searchInput.fill('наушники');

    // Ждем завершения дебаунса
    await page.waitForTimeout(500);

    // Должна остаться карточка с наушниками
    const productTitles = page.locator('.product-title');
    await expect(productTitles.first()).toContainText('Беспроводные наушники SoundPro X');
    
    // Количество найденных товаров должно быть 1
    await expect(page.getByText('Найдено товаров: 1')).toBeVisible();
  });

  test('TC-STOCK-03: Товар с нулевым остатком отображается как "Распродано" и кнопка заблокирована', async ({ page }) => {
    // Фильтруем категорию "Электроника"
    await page.getByRole('button', { name: 'Электроника' }).click();

    // Ищем карточку с часами FitPulse (stock: 0)
    const outOfStockCard = page.locator('.product-card').filter({ hasText: 'Умные часы FitPulse' });
    await expect(outOfStockCard).toBeVisible();

    // Проверяем бирку "Нет в наличии"
    await expect(outOfStockCard.locator('.stock-out')).toHaveText('Нет в наличии');

    // Кнопка должна быть заблокирована (disabled)
    const button = outOfStockCard.getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toContainText('Распродано');
  });

  test('TC-CHECKOUT-04: Полный путь покупки — Корзина, Промокод QA2026 (-20%) и Оплата', async ({ page }) => {
    // 1. Добавляем в корзину первый доступный товар
    const firstAddButton = page.locator('.product-card').filter({ hasText: 'SoundPro X' }).getByRole('button', { name: /В корзину/i });
    await firstAddButton.click();

    // Проверяем появление тоста об успехе
    await expect(page.locator('.toast')).toContainText('успешно добавлен в корзину');

    // Проверяем бейдж корзины в шапке (цифра 1)
    await expect(page.locator('.cart-badge')).toHaveText('1');

    // 2. Открываем корзину
    await page.getByRole('button', { name: /Корзина/i }).click();
    await expect(page.getByRole('heading', { name: 'Корзина покупок' })).toBeVisible();

    // 3. Вводим промокод QA2026
    const promoInput = page.getByPlaceholder(/Промокод/i);
    await promoInput.fill('QA2026');
    await page.getByRole('button', { name: 'Применить' }).click();

    // Проверяем применение скидки 20%
    await expect(page.getByText(/Скидка 20% по промокоду QA2026/i)).toBeVisible();
    await expect(page.getByText(/Скидка \(QA2026\):/i)).toBeVisible();

    // 4. Переходим к оформлению
    await page.getByRole('button', { name: /Оформить заказ/i }).click();
    await expect(page.getByRole('heading', { name: 'Оформление доставки' })).toBeVisible();

    // 5. Заполняем форму получателя
    await page.getByPlaceholder('Иван Иванов').fill('Петр Тестировщиков');
    await page.getByPlaceholder('email@example.com').fill('petr@qa-auto.com');
    await page.getByPlaceholder('+7 (999) 000-00-00').fill('+7 (999) 777-88-99');
    await page.getByPlaceholder('Город, улица, дом, квартира').fill('г. Санкт-Петербург, Невский пр., д. 10');

    // 6. Нажимаем подтвердить заказ
    await page.getByRole('button', { name: /Подтвердить и оплатить/i }).click();

    // 7. Проверяем экран успешного заказа
    await expect(page.getByRole('heading', { name: 'Спасибо за заказ!' })).toBeVisible();
    await expect(page.getByText(/Номер вашего заказа: ORD-/i)).toBeVisible();
    await expect(page.getByText('Петр Тестировщиков')).toBeVisible();
  });

  test('TC-QUEST-05: Модальное окно Bug Hunter открывается и содержит 10 багов', async ({ page }) => {
    // Нажимаем кнопку Bug Hunter в шапке
    await page.getByRole('button', { name: /Bug Hunter/i }).click();

    // Проверяем заголовок квеста
    await expect(page.getByRole('heading', { name: /Bug Hunter Quest/i })).toBeVisible();

    // Проверяем наличие 10 чекбоксов багов
    const bugCheckboxes = page.locator('input[type="checkbox"]');
    await expect(bugCheckboxes).toHaveCount(10);

    // Проверяем переключатель "Включить баги"
    await expect(page.getByRole('button', { name: /Включить баги/i })).toBeVisible();
  });

});

import http from 'k6/http';
import { check, sleep, group } from 'k6';

// ⚙️ Настройки и профиль нагрузки (Load Profile)
export const options = {
  stages: [
    { duration: '10s', target: 10 }, // 1. Разгон (Ramp-up): плавный подъем до 10 пользователей
    { duration: '30s', target: 20 }, // 2. Основная полка нагрузки: 20 одновременных пользователей
    { duration: '10s', target: 0 },  // 3. Спад (Ramp-down): завершение сессий
  ],
  thresholds: {
    // 95% запросов должны выполняться быстрее 400мс
    http_req_duration: ['p(95)<400', 'p(99)<800'],
    // Процент ошибок не должен превышать 1%
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_HOST || 'http://localhost:5000';

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // 1. Просмотр витрины (Browsing)
  group('01. Каталог товаров', () => {
    const res = http.get(`${BASE_URL}/api/v1/products`);
    check(res, {
      'Каталог: статус 200': (r) => r.status === 200,
      'Каталог: вернулся список товаров': (r) => JSON.parse(r.body).length > 0,
    });
  });

  sleep(1);

  // 2. Поиск и фильтрация (Search & Filter)
  group('02. Фильтрация по категории', () => {
    const res = http.get(`${BASE_URL}/api/v1/products?category=Электроника`);
    check(res, {
      'Фильтр: статус 200': (r) => r.status === 200,
      'Фильтр: отклик быстрее 300мс': (r) => r.timings.duration < 300,
    });
  });

  sleep(1);

  // 3. Добавление товара в корзину (Add to Cart)
  group('03. Добавление в корзину', () => {
    const payload = JSON.stringify({ productId: 1, quantity: 1 });
    const res = http.post(`${BASE_URL}/api/v1/cart`, payload, { headers });
    check(res, {
      'Корзина: статус 200': (r) => r.status === 200,
    });
  });

  sleep(1);

  // 4. Оформление заказа (Checkout)
  group('04. Оформление заказа', () => {
    const orderPayload = JSON.stringify({
      customer: {
        name: `K6 Load User ${__VU}`,
        email: `loaduser${__VU}@perf-test.com`,
        phone: '+7 999 111-22-33',
        address: 'ул. Нагрузочная, д. 100',
        paymentMethod: 'CARD'
      },
      promoCode: 'QA2026',
      items: [
        { productId: 1, quantity: 1 }
      ]
    });

    const res = http.post(`${BASE_URL}/api/v1/orders/checkout`, orderPayload, { headers });
    check(res, {
      'Заказ: статус 201': (r) => r.status === 201,
      'Заказ: присвоен ID': (r) => JSON.parse(r.body).order?.id !== undefined,
    });
  });

  sleep(2);
}

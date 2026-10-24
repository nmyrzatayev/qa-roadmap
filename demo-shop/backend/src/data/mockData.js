// Initial mock data for the QA training shop

export const initialProducts = [
  {
    id: 1,
    title: "Беспроводные наушники SoundPro X",
    category: "Электроника",
    price: 4990,
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    description: "Наушники с активным шумоподавлением (ANC), 30 часов работы от аккумулятора и быстрая зарядка.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    id: 2,
    title: "Механическая клавиатура RGB Clicker",
    category: "Электроника",
    price: 7490,
    rating: 4.6,
    reviewsCount: 89,
    stock: 7,
    description: "Компактная клавиатура 75% с красными свичами Hot-swap, настраиваемой подсветкой и алюминиевым корпусом.",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
  },
  {
    id: 3,
    title: "Умные часы FitPulse Track 3",
    category: "Электроника",
    price: 8990,
    rating: 4.7,
    reviewsCount: 215,
    stock: 0, // Out of stock on purpose for QA edge case testing!
    description: "Пульсометр, мониторинг сна, влагозащита 5ATM, яркий AMOLED-дисплей.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    id: 4,
    title: "Худи оверсайз «Debug or Die»",
    category: "Одежда",
    price: 3490,
    rating: 4.9,
    reviewsCount: 56,
    stock: 25,
    description: "Плотный хлопок 100%, удобный капюшон, стильный принт для разработчиков и тестировщиков.",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80"
  },
  {
    id: 5,
    title: "Рюкзак для ноутбука Urban City 20L",
    category: "Аксессуары",
    price: 4290,
    rating: 4.5,
    reviewsCount: 42,
    stock: 12,
    description: "Водоотталкивающая ткань, отсек для ноутбука 15.6'', скрытый антивор-карман и USB-порт.",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
  },
  {
    id: 6,
    title: "Книга «Тестирование Дот Ком»",
    category: "Книги",
    price: 1290,
    rating: 5.0,
    reviewsCount: 310,
    stock: 50,
    description: "Культовое пособие Романа Савина по тестированию ПО для новичков и практикующих специалистов.",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80"
  },
  {
    id: 7,
    title: "Термокружка из нержавеющей стали 500ml",
    category: "Аксессуары",
    price: 1590,
    rating: 4.3,
    reviewsCount: 38,
    stock: 30,
    description: "Держит тепло до 12 часов, герметичный клапан, покрытие soft-touch.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80"
  },
  {
    id: 8,
    title: "Геймерская мышь HyperSpeed Wireless",
    category: "Электроника",
    price: 5290,
    rating: 4.7,
    reviewsCount: 94,
    stock: 5,
    description: "Сверхлегкий вес 60 грамм, оптический сенсор 26000 DPI, сверхнизкая задержка 1мс.",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80"
  }
];

export const promoCodes = {
  "QA2026": { discountPercent: 20, description: "Скидка 20% для тестировщиков" },
  "FREESHIP": { freeShipping: true, description: "Бесплатная доставка" },
  "FIRST10": { discountPercent: 10, description: "Скидка 10% на первый заказ" }
};

export const initialOrders = [
  {
    id: "ORD-101928",
    customerName: "Иван Тестеров",
    customerEmail: "ivan@test.ru",
    customerPhone: "+7 (999) 111-22-33",
    customerAddress: "г. Москва, ул. Ленина, д. 42, кв. 10",
    paymentMethod: "CARD",
    itemsJson: [
      { productId: 1, title: "Беспроводные наушники SoundPro X", price: 4990, quantity: 1, total: 4990 }
    ],
    subtotal: 4990,
    discount: 998,
    shipping: 0,
    total: 3992,
    status: "DELIVERED",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "ORD-102450",
    customerName: "Анна Смирнова",
    customerEmail: "anna.qa@gmail.com",
    customerPhone: "+7 (999) 444-55-66",
    customerAddress: "г. Санкт-Петербург, Невский пр., д. 15",
    paymentMethod: "CARD",
    itemsJson: [
      { productId: 4, title: "Худи оверсайз «Debug or Die»", price: 3490, quantity: 2, total: 6980 },
      { productId: 6, title: "Книга «Тестирование Дот Ком»", price: 1290, quantity: 1, total: 1290 }
    ],
    subtotal: 8270,
    discount: 0,
    shipping: 350,
    total: 8620,
    status: "PAID",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "ORD-103891",
    customerName: "Дмитрий Ковалев",
    customerEmail: "dmitry@corp.ru",
    customerPhone: "+7 (999) 777-00-11",
    customerAddress: "г. Казань, ул. Баумана, д. 5",
    paymentMethod: "CASH",
    itemsJson: [
      { productId: 2, title: "Механическая клавиатура RGB Clicker", price: 7490, quantity: 1, total: 7490 }
    ],
    subtotal: 7490,
    discount: 749,
    shipping: 350,
    total: 7091,
    status: "PAID",
    createdAt: new Date().toISOString()
  }
];

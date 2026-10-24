export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "QA Sandbox E-Commerce API",
    version: "1.0.0",
    description: "Учебное REST API интернет-магазина для практики ручного и автоматизированного тестирования. Включает эндпоинты товаров, корзины, чекаута и специальные инструменты для симуляции хаоса и сбоев (Chaos QA).",
    contact: {
      name: "QA Academy Team",
      email: "support@qa-roadmap.local"
    }
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Локальный тестовый сервер"
    }
  ],
  tags: [
    { name: "Products", description: "Каталог товаров (поиск, фильтрация, пагинация)" },
    { name: "Cart", description: "Управление корзиной покупателя" },
    { name: "Orders", description: "Оформление заказа и история покупок" },
    { name: "Auth", description: "Аутентификация и профиль пользователя" },
    { name: "QA Tools", description: "Инструменты для тестирования сбоев, задержек и сброса БД" },
    { name: "Postman Integration", description: "Экспорт готовой коллекции и инструкций для Postman" }
  ],
  paths: {
    "/api/v1/products": {
      get: {
        tags: ["Products"],
        summary: "Получить список товаров с фильтрацией и пагинацией",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Поисковый запрос (по названию или описанию)" },
          { name: "category", in: "query", schema: { type: "string", enum: ["Все", "Электроника", "Одежда", "Аксессуары", "Книги"] }, description: "Категория товара" },
          { name: "minPrice", in: "query", schema: { type: "number" }, description: "Минимальная цена" },
          { name: "maxPrice", in: "query", schema: { type: "number" }, description: "Максимальная цена" },
          { name: "sort", in: "query", schema: { type: "string", enum: ["default", "price_asc", "price_desc", "rating"] }, description: "Сортировка" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Номер страницы" },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 }, description: "Элементов на странице" }
        ],
        responses: {
          200: {
            description: "Успешный список товаров",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 8 },
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 10 },
                    totalPages: { type: "integer", example: 1 },
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Products"],
        summary: "Создать новый товар (для тестирования добавления)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "category", "price", "stock"],
                properties: {
                  title: { type: "string", example: "Беспроводная мышь" },
                  category: { type: "string", example: "Электроника" },
                  price: { type: "number", example: 1990 },
                  stock: { type: "integer", example: 10 },
                  description: { type: "string", example: "Удобная мышь для работы" },
                  imageUrl: { type: "string", example: "https://example.com/image.jpg" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Товар успешно создан", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
          400: { description: "Ошибка валидации входных данных" }
        }
      }
    },
    "/api/v1/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Получить детальную информацию о товаре по ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID товара" }
        ],
        responses: {
          200: { description: "Данные товара", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
          404: { description: "Товар с указанным ID не найден" }
        }
      },
      delete: {
        tags: ["Products"],
        summary: "Удалить товар по ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Товар удален" },
          404: { description: "Товар не найден" }
        }
      }
    },
    "/api/v1/cart": {
      get: {
        tags: ["Cart"],
        summary: "Получить текущую корзину",
        responses: {
          200: {
            description: "Список товаров в корзине",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          productId: { type: "integer" },
                          quantity: { type: "integer" },
                          subtotal: { type: "number" },
                          product: { $ref: "#/components/schemas/Product" }
                        }
                      }
                    },
                    totalAmount: { type: "number", example: 4990 }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Cart"],
        summary: "Полностью очистить корзину",
        responses: {
          200: { description: "Корзина очищена" }
        }
      }
    },
    "/api/v1/cart/items": {
      post: {
        tags: ["Cart"],
        summary: "Добавить товар в корзину",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId"],
                properties: {
                  productId: { type: "integer", example: 1 },
                  quantity: { type: "integer", default: 1, example: 1 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Товар добавлен в корзину" },
          400: { description: "Превышен остаток на складе" },
          404: { description: "Товар не найден" }
        }
      },
      put: {
        tags: ["Cart"],
        summary: "Изменить количество единиц товара в корзине",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "integer", example: 1 },
                  quantity: { type: "integer", example: 2 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Количество обновлено" },
          400: { description: "Недостаточно товара на складе" }
        }
      }
    },
    "/api/v1/cart/items/{productId}": {
      delete: {
        tags: ["Cart"],
        summary: "Удалить позицию из корзины",
        parameters: [
          { name: "productId", in: "path", required: true, schema: { type: "integer" } }
        ],
        responses: {
          200: { description: "Позиция удалена" }
        }
      }
    },
    "/api/v1/orders/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Оформить заказ (Checkout)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["customer", "items"],
                properties: {
                  customer: {
                    type: "object",
                    required: ["name", "email", "phone", "address"],
                    properties: {
                      name: { type: "string", example: "Иван Тестеров" },
                      email: { type: "string", example: "ivan@test.ru" },
                      phone: { type: "string", example: "+7 (999) 000-11-22" },
                      address: { type: "string", example: "г. Москва, ул. Тестовая, д. 42" },
                      paymentMethod: { type: "string", enum: ["CARD", "CASH"], default: "CARD" }
                    }
                  },
                  promoCode: { type: "string", example: "QA2026", description: "Промокод на скидку (QA2026, FREESHIP, FIRST10)" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "quantity"],
                      properties: {
                        productId: { type: "integer", example: 1 },
                        quantity: { type: "integer", example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Заказ успешно создан и оплачен",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    order: { $ref: "#/components/schemas/Order" }
                  }
                }
              }
            }
          },
          400: { description: "Ошибка валидации клиента или пустая корзина" },
          409: { description: "Конфликт: товар закончился на складе" }
        }
      }
    },
    "/api/v1/orders": {
      get: {
        tags: ["Orders"],
        summary: "Список всех оформленных заказов",
        responses: {
          200: {
            description: "История заказов",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Авторизация пользователя (тестовые: tester@qa.com / password123)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "tester@qa.com" },
                  password: { type: "string", example: "password123" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Успешный вход",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", example: "jwt-token-sample-qa-2026" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: "Неверный логин или пароль" }
        }
      }
    },
    "/api/v1/qa/reset": {
      post: {
        tags: ["QA Tools"],
        summary: "Сбросить состояние базы данных к исходным данным",
        responses: {
          200: { description: "База данных успешно сброшена" }
        }
      }
    },
    "/api/v1/qa/simulate-chaos": {
      post: {
        tags: ["QA Tools"],
        summary: "Настроить искусственные сбои (задержка ответов или принудительный статус ошибки)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  delayMs: { type: "integer", example: 1500, description: "Искусственная задержка в миллисекундах" },
                  forceStatus: { type: "integer", example: 500, nullable: true, description: "Принудительный код ошибки (500, 503, 504) или null для нормальной работы" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Настройки симуляции применены" }
        }
      }
    },
    "/api/v1/postman/instructions": {
      get: {
        tags: ["Postman Integration"],
        summary: "Получить подробные шаги и ссылки для импорта всех запросов в Postman",
        responses: {
          200: {
            description: "JSON с пошаговой инструкцией и переменными окружения"
          }
        }
      }
    },
    "/api/v1/postman/collection.json": {
      get: {
        tags: ["Postman Integration"],
        summary: "Скачать готовую коллекцию Postman v2.1 с настроенными тестами (pm.test)",
        responses: {
          200: {
            description: "JSON файл коллекции Postman"
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Беспроводные наушники SoundPro X" },
          category: { type: "string", example: "Электроника" },
          price: { type: "number", example: 4990 },
          rating: { type: "number", example: 4.8 },
          reviewsCount: { type: "integer", example: 124 },
          stock: { type: "integer", example: 15 },
          description: { type: "string", example: "Наушники с активным шумоподавлением..." },
          imageUrl: { type: "string", example: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" }
        }
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string", example: "ORD-948123" },
          createdAt: { type: "string", example: "2026-10-24T14:30:00.000Z" },
          customer: {
            type: "object",
            properties: {
              name: { type: "string", example: "Иван Тестеров" },
              email: { type: "string", example: "ivan@test.ru" },
              phone: { type: "string", example: "+7 (999) 000-11-22" },
              address: { type: "string", example: "г. Москва, ул. Ленина, д. 1" },
              paymentMethod: { type: "string", example: "CARD" }
            }
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "integer" },
                title: { type: "string" },
                price: { type: "number" },
                quantity: { type: "integer" },
                total: { type: "number" }
              }
            }
          },
          subtotal: { type: "number", example: 4990 },
          discount: { type: "number", example: 998 },
          shipping: { type: "number", example: 0 },
          total: { type: "number", example: 3992 },
          status: { type: "string", example: "PAID" }
        }
      }
    }
  }
};

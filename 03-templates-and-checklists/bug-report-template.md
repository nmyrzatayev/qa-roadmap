# Шаблон профессионального баг-репорта

> Настоящий баг-репорт должен быть составлен так, чтобы разработчик мог воспроизвести и понять проблему за 30 секунд без дополнительных вопросов.

---

## 📋 Markdown-шаблон для копирования в Jira / YouTrack / GitHub Issues

```markdown
### Summary
[Что сломалось] + [Где сломалось] + [При каких условиях]

### Severity & Priority
- **Severity**: Blocker | Critical | Major | Minor | Trivial
- **Priority**: High | Medium | Low

### Environment
- **App Version / Commit**: v1.24.0 (build 309)
- **Environment**: Staging (https://staging.app.example.com)
- **OS**: Windows 11 / macOS Sonoma / Android 14 / iOS 17.4
- **Browser / Device**: Google Chrome 122.0 / iPhone 15 Pro
- **User Role**: Зарегистрированный покупатель без премиум-подписки

### Preconditions
1. Пользователь авторизован в системе под логином `tester_user@example.com`.
2. В корзине находится 1 товар с доступным остатком 0 шт. (или применен промокод `SUMMER2026`).

### Steps to Reproduce
1. Перейти на страницу корзины `/cart`.
2. Нажать кнопку "Перейти к оформлению".
3. Выбрать способ доставки "Курьером" и ввести адрес `г. Москва, ул. Ленина, д. 1`.
4. Нажать кнопку "Оплатить заказ".

### Actual Result
Появляется бесконечный спиннер загрузки. В консоли DevTools ошибка `500 Internal Server Error` на запрос `POST /api/v1/orders/checkout`. Заказ не создается.

### Expected Result
Отображается понятное предупреждение: "Один из товаров в корзине закончился на складе", спиннер исчезает, кнопка остается активной для изменения состава корзины.

### Attachments
- Скриншот экрана с ошибкой: `screenshot_checkout_error.png`
- Логи консоли: `console_logs.txt`
- HAR-файл сетевых запросов: `checkout_network_trace.har`
```

---

## 🔍 Реальный пример заполненного баг-репорта

### Summary
Ошибка 500 при попытке сохранить аватар пользователя в формате .WEBP размером > 5МБ в личном кабинете

### Severity & Priority
- **Severity**: Major (функционал загрузки профиля частично сломан для популярного формата)
- **Priority**: Medium

### Environment
- **URL**: `https://dev-stand.shop.ru/profile/settings`
- **Device / OS**: MacBook Pro M2, macOS 14.3
- **Browser**: Google Chrome 122.0.6261.94 (Official Build, arm64)
- **Test Account**: `qa-auto-test-12@test.ru`

### Preconditions
1. Пользователь залогинен и находится на странице настроек профиля.
2. В локальной папке подготовлен файл `avatar_high_res.webp` размером 6.2 МБ.

### Steps to Reproduce
1. Нажать на иконку фотоаппарата рядом с текущим аватаром.
2. В системном диалоговом окне выбрать файл `avatar_high_res.webp`.
3. Нажать кнопку "Сохранить изменения" внизу формы.

### Actual Result
1. Модальное окно зависает в состоянии загрузки.
2. Появляется всплывающее красное уведомление: `"Something went wrong"`.
3. В ответе на запрос `POST /api/v1/users/me/avatar` сервер возвращает статус `500`:
   ```json
   {
     "status": 500,
     "error": "InternalServerError",
     "message": "ImageMagick unsupported delegate or memory allocation failed"
   }
   ```

### Expected Result
1. Если файл превышает допустимый размер (лимит 5 МБ), срабатывает клиентская и серверная валидация:
   - Статус ответа сервера: `400 Bad Request` или `422 Unprocessable Entity`.
   - Текст ошибки пользователю: *"Максимальный размер фото — 5 МБ. Пожалуйста, выберите файл меньшего размера"*.
2. Кнопка "Сохранить" разблокируется для повторного выбора файла.

### Attachments
- `[Video]` Скринкаст воспроизведения бага: `bug_reproduce_avatar.mp4`
- `[Log]` Фрагмент серверного лога `docker_backend_app.log`

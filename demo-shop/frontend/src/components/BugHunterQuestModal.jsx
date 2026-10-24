import React, { useState } from 'react';
import { X, Bug, CheckCircle2, ChevronDown, ChevronUp, Trophy, AlertTriangle, Lightbulb, FileText } from 'lucide-react';

export const BUGS_LIST = [
  {
    id: 'BUG-01',
    category: 'Корзина / Валидация',
    title: 'Разрешено устанавливать отрицательное и нулевое количество товаров',
    difficulty: 'Легкий',
    hint: 'В режиме Buggy Mode откройте корзину и уменьшите количество товара кнопкой «минус». Что происходит при значении 0 или -1?',
    bugReport: {
      summary: 'Возможность добавления отрицательного количества товара в корзину при нажатии кнопки уменьшения количества',
      severity: 'Major',
      steps: [
        '1. Добавить 1 шт. товара в корзину',
        '2. Открыть корзину и нажать кнопку "-"',
        '3. Наблюдать количество 0 и -1'
      ],
      expected: 'Количество не должно опускаться ниже 1, либо при 0 товар должен удаляться из корзины с подтверждением',
      actual: 'Количество товара становится отрицательным, итоговая сумма корзины уменьшается (можно получить отрицательный счет)'
    }
  },
  {
    id: 'BUG-02',
    category: 'Финансы / Округление',
    title: 'Отображение бесконечных дробных копеек при расчете скидки',
    difficulty: 'Легкий',
    hint: 'Примените промокод QA2026 к товару с ценой, дающей дробный процент (например, худи за 3490 ₽). Посмотрите на сумму скидки и итог.',
    bugReport: {
      summary: 'Отсутствие округления до сотых/целых при расчете скидки (выводится 199.99999999999997 ₽)',
      severity: 'Medium',
      steps: [
        '1. Добавить худи за 3 490 ₽ в корзину',
        '2. Применить промокод QA2026',
        '3. Посмотреть на блок расчета скидки'
      ],
      expected: 'Сумма скидки и итоговая цена должны округляться до копеек (2 знака) или целых рублей',
      actual: 'Выводится некрасивое число с плавающей точкой (floating point precision error)'
    }
  },
  {
    id: 'BUG-03',
    category: 'Безопасность / XSS',
    title: 'Уязвимость внедрения HTML/JS кода в поле имени покупателя (Stored XSS)',
    difficulty: 'Средний',
    hint: 'В поле ФИО на шаге оформления заказа введите: <b style="color:red">Взломано</b> или <i>Тестер</i> и завершите заказ.',
    bugReport: {
      summary: 'Отсутствие санитайзинга HTML-тегов в поле имени получателя на странице успешного заказа',
      severity: 'Critical / High',
      steps: [
        '1. Перейти к оформлению заказа',
        '2. В поле ФИО ввести: <u style="color:red">Тестовый XSS</u>',
        '3. Нажать кнопку "Оплатить"',
        '4. Посмотреть на блок получателя на экране успеха'
      ],
      expected: 'Имя должно экранироваться и выводиться как обычный текст: &lt;u&gt;...',
      actual: 'HTML-теги исполняются браузером напрямую (уязвимость межсайтового скриптинга XSS)'
    }
  },
  {
    id: 'BUG-04',
    category: 'UX / Потеря данных',
    title: 'Сброс всех введенных данных анкеты при случайном клике мимо модалки',
    difficulty: 'Легкий',
    hint: 'Начните оформлять заказ, введите длинный адрес и телефон, а затем случайно кликните в серую область фона за пределами окна.',
    bugReport: {
      summary: 'Модальное окно чекаута закрывается по клику на overlay без предупреждения о несохраненных данных',
      severity: 'Minor / Usability',
      steps: [
        '1. Заполнить форму заказа',
        '2. Кликнуть за пределами модального окна (backdrop)',
        '3. Снова открыть чекаут'
      ],
      expected: 'Появляется диалог подтверждения отмены, либо введенные данные сохраняются в черновике',
      actual: 'Окно мгновенно исчезает, все введенные данные пользователя стираются'
    }
  },
  {
    id: 'BUG-05',
    category: 'Concurrency / Бэкенд',
    title: 'Кнопка оплаты не блокируется во время запроса (уязвимость к дублированию платежей)',
    difficulty: 'Сложный',
    hint: 'Включите задержку сети 2.5 сек в QA Sandbox, а затем быстро сделайте 3–5 кликов по кнопке «Подтвердить и оплатить».',
    bugReport: {
      summary: 'Отсутствие блокировки (debounce/disable) кнопки подтверждения оплаты при активном сетевом запросе',
      severity: 'Critical',
      steps: [
        '1. Включить задержку сети 2500 мс',
        '2. Нажать 4 раза на кнопку "Подтвердить и оплатить"',
        '3. Проверить историю заказов в базе данных'
      ],
      expected: 'После первого клика кнопка переходит в disabled-состояние и отображает спиннер',
      actual: 'Кнопка остается активной, на бэкенд уходит пачка параллельных запросов, создавая дублирующие заказы'
    }
  },
  {
    id: 'BUG-06',
    category: 'Бизнес-логика / Склад',
    title: 'Возможность купить распроданный товар с нулевым остатком (ID: 3)',
    difficulty: 'Средний',
    hint: 'В каталоге товар «Умные часы FitPulse» имеет статус «Нет в наличии». Но что если добавить его через API или корзину?',
    bugReport: {
      summary: 'Бэкенд пропускает оформление заказа на товар с нулевым складским остатком',
      severity: 'Major',
      steps: [
        '1. Отправить POST /api/v1/orders/checkout с productId: 3 (остаток 0)',
        '2. Проверить ответ сервера'
      ],
      expected: 'Ответ 409 Conflict: "Товар закончился на складе"',
      actual: 'Заказ успешно оформляется, склад уходит в отрицательный баланс'
    }
  },
  {
    id: 'BUG-07',
    category: 'Валидация / Регистр',
    title: 'Промокод чувствителен к регистру (qa2026 выдает ошибку, а QA2026 работает)',
    difficulty: 'Легкий',
    hint: 'Введите промокод маленькими буквами: qa2026. Сработает ли скидка?',
    bugReport: {
      summary: 'Поле промокода не приводит введенный текст к верхнему регистру перед проверкой',
      severity: 'Minor',
      steps: [
        '1. В корзине ввести промокод строчными буквами "qa2026"',
        '2. Нажать "Применить"'
      ],
      expected: 'Промокод срабатывает независимо от регистра букв (case-insensitive)',
      actual: 'Выдается ошибка "Недействительный промокод"'
    }
  },
  {
    id: 'BUG-08',
    category: 'Валидация полей',
    title: 'Поле «Телефон» принимает любые буквы и не валидирует маску номера',
    difficulty: 'Легкий',
    hint: 'В поле телефона введите буквы: "номер телефона" или "abc". Пройдет ли валидация?',
    bugReport: {
      summary: 'Отсутствие регулярного выражения для проверки номера телефона покупателя',
      severity: 'Major',
      steps: [
        '1. Ввести в поле телефона "abcde"',
        '2. Нажать "Оплатить"'
      ],
      expected: 'Ошибка валидации: "Введите корректный номер телефона (например +7 999 123-45-67)"',
      actual: 'Форма успешно отправляется с невалидным телефоном'
    }
  },
  {
    id: 'BUG-09',
    category: 'Accessibility / a11y',
    title: 'Отсутствие ловушки фокуса клавиатуры (Focus Trap) в модальных окнах',
    difficulty: 'Средний',
    hint: 'Откройте любое окно и переключайтесь клавишей Tab. Уходит ли курсор за пределы окна на скрытую подложку сайта?',
    bugReport: {
      summary: 'Фокус клавиши Tab проваливается на элементы подложки при открытом модальном окне',
      severity: 'Minor / Accessibility',
      steps: [
        '1. Открыть окно чекаута',
        '2. Нажимать клавишу Tab многократно'
      ],
      expected: 'Фокус циклично перемещается только внутри модального окна (Focus Trap)',
      actual: 'Фокус уходит на кнопки шапки сайта, которые не видны под затемненным оверлеем'
    }
  },
  {
    id: 'BUG-10',
    category: 'Сеть / UX Ошибок',
    title: 'Неинформативное сообщение об ошибке при сбое сервера (HTTP 500)',
    difficulty: 'Легкий',
    hint: 'В панели QA включите симуляцию ошибки 500, перейдите в чекаут и нажмите оплатить. Понятно ли пользователю, что делать?',
    bugReport: {
      summary: 'Отображение сырого технического сообщения ошибки без инструкций для пользователя',
      severity: 'Minor / UX',
      steps: [
        '1. Включить симуляцию HTTP 500',
        '2. Оформить заказ'
      ],
      expected: 'Понятный экран: "Произошел сбой при связи с банком. Ваши деньги не списаны. Пожалуйста, повторите попытку через 2 минуты"',
      actual: 'Отображается красная техническая ошибка [SIMULATED_CHAOS]'
    }
  }
];

export default function BugHunterQuestModal({ 
  isOpen, 
  onClose, 
  isBuggyMode, 
  onToggleBuggyMode 
}) {
  const [foundBugs, setFoundBugs] = useState(() => {
    try {
      const saved = localStorage.getItem('qa_found_bugs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [expandedBug, setExpandedBug] = useState(null);

  if (!isOpen) return null;

  const toggleBugCheck = (id) => {
    let updated;
    if (foundBugs.includes(id)) {
      updated = foundBugs.filter(b => b !== id);
    } else {
      updated = [...foundBugs, id];
    }
    setFoundBugs(updated);
    try {
      localStorage.setItem('qa_found_bugs', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const score = foundBugs.length;
  let rank = 'Начинающий Тестировщик';
  let rankColor = '#64748b';
  if (score >= 8) {
    rank = 'Senior Bug Hunter 🏆';
    rankColor = '#10b981';
  } else if (score >= 4) {
    rank = 'Middle QA Hunter 🎯';
    rankColor = '#4f46e5';
  } else if (score >= 1) {
    rank = 'Junior Bug Hunter 🔍';
    rankColor = '#f59e0b';
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header" style={{ background: '#fdf2f8', borderBottomColor: '#fbcfe8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#be185d' }}>
            <Bug size={22} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              🏆 Bug Hunter Quest — Охота за багами
            </h2>
          </div>
          <button onClick={onClose} style={{ color: '#be185d' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Buggy Mode Switch Banner */}
          <div style={{ 
            background: isBuggyMode ? '#fef2f2' : '#f8fafc', 
            border: `2px solid ${isBuggyMode ? '#ef4444' : '#e2e8f0'}`, 
            padding: '16px', 
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: isBuggyMode ? '#b91c1c' : '#0f172a' }}>
                {isBuggyMode ? '🔥 Режим «Buggy Mode» ВКЛЮЧЕН' : '🛡️ Стандартный режим (Был чистым)'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                {isBuggyMode 
                  ? 'В магазине активированы 10 скрытых дефектов! Ищите их в корзине, чекауте и валидации.' 
                  : 'Включите переключатель, чтобы активировать тренировочные баги в приложении.'}
              </div>
            </div>

            <button
              onClick={onToggleBuggyMode}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: isBuggyMode ? '#ef4444' : '#4f46e5',
                color: '#fff',
                whiteSpace: 'nowrap'
              }}
            >
              {isBuggyMode ? 'Выключить баги' : 'Включить баги'}
            </button>
          </div>

          {/* Progress Bar & Rank */}
          <div style={{ background: '#f1f5f9', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                Прогресс поиска багов:
              </span>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: rankColor }}>
                {score} из 10 найдено • {rank}
              </span>
            </div>

            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${(score / 10) * 100}%`, 
                  height: '100%', 
                  background: score >= 8 ? '#10b981' : '#4f46e5', 
                  transition: 'width 0.3s ease' 
                }} 
              />
            </div>
          </div>

          {/* Bugs List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {BUGS_LIST.map((bug) => {
              const isFound = foundBugs.includes(bug.id);
              const isExpanded = expandedBug === bug.id;

              return (
                <div 
                  key={bug.id} 
                  style={{ 
                    border: `1px solid ${isFound ? '#a7f3d0' : '#e2e8f0'}`,
                    background: isFound ? '#f0fdf4' : '#ffffff',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <input 
                        type="checkbox" 
                        checked={isFound}
                        onChange={() => toggleBugCheck(bug.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', background: '#e2e8f0', borderRadius: '4px' }}>
                            {bug.id}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {bug.category}
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '2px', textDecoration: isFound ? 'line-through' : 'none', color: isFound ? '#15803d' : '#0f172a' }}>
                          {bug.title}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setExpandedBug(isExpanded ? null : bug.id)}
                      style={{ color: '#64748b', padding: '4px' }}
                      title="Подробнее"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Expanded Details: Hint and Sample Bug Report */}
                  {isExpanded && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #cbd5e1', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#fffbeb', padding: '10px', borderRadius: '8px', color: '#92400e', marginBottom: '10px' }}>
                        <Lightbulb size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div><b>Подсказка:</b> {bug.hint}</div>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                          <FileText size={14} />
                          <span>Образец правильного баг-репорта:</span>
                        </div>
                        <div style={{ marginBottom: '4px' }}><b>Summary:</b> {bug.bugReport.summary}</div>
                        <div style={{ marginBottom: '4px' }}><b>Severity:</b> <code>{bug.bugReport.severity}</code></div>
                        <div style={{ marginBottom: '4px' }}><b>Шаги:</b></div>
                        <ul style={{ paddingLeft: '20px', margin: '4px 0' }}>
                          {bug.bugReport.steps.map((st, i) => (
                            <li key={i}>{st}</li>
                          ))}
                        </ul>
                        <div style={{ marginTop: '4px' }}><b>Expected:</b> {bug.bugReport.expected}</div>
                        <div style={{ marginTop: '4px' }}><b>Actual:</b> {bug.bugReport.actual}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка товара

```
export interface ICard {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
    inBasket?: boolean;
}
```

Главная страница

```
export interface IPage {
    counter: number;
    gallery: ICard[];
    locked: boolean;
}
```

Модальное окно корзины

```
export interface IBasket {
    items: ICard[];
    total: number;
}
```

Модальное окно формы оплаты и указания адреса доставки

```
export interface IOrder {
    payment: string;
    address: string;
}
```

Модальное окно формы контактов (телефон, почта)

```
export interface IContact {
    email: string;
    phone: string;
}
```

Модальное окно для уведомления об успешном завершении покупки

```
export interface IOrderResult {
    id?: string;
    total?: number;
}
```

Интерфейс для модели данных магазина

```
export interface IShopsData {
    cards: ICard[];
    basket: ICard[];
    preview: string | null;
    order: IOrderData | null;
    getCard(cardId: string): ICard | undefined;
    hasCardInBasket(cardId: string): boolean;
    setCards(items: ICard[]): void;
    addBasket(card: ICard): boolean;
    removeBasket(card: ICard): void;
    setOrderField(field: keyof OrderField, value: string): void;
    getTotal?(): number;
}
```

Данные ответа API для списка товаров

```
export interface ICards {
    total: number;
    items: ICard[];
}
```

Статус заказа (валидации)

```
export interface IOrderStatus {
    status: boolean;
    message: string;
}
```

Данные API магазина

```
export interface IShopApi {
    baseUrl: string;
    cdnUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

Интерфейс заказа

```
export interface IOrderData extends OrderField {
    items: string[];
    total: number;
}
```

Обедененные два модальных окна (оплата и контакты)

```
export type OrderField = IOrder & IContact;
```

Данные формы адреса, почты, телефон

```
export type OrderForm = Pick<UserData, 'address' | 'email' | 'phone'>
```

Данные ошибок валидации формы

```
export type FormErrors = Partial<Record<keyof IOrderData, string>>;
```

Тип для HTTP методов POST, PUT, DELETE

```
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### Класс ShopData
Класс отвечает за хранение и логику работы с данными магазина.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _cards: ICard[] - массив объектов карточек
- _basket: ICard[] - массив объектов карточек в корзине
- _preview: string | null - id карточки, выбранной для просмотра в модальной окне
- _order: IOrderData | null - данные заказа.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- getCard(cardId: string): ICard | undefined - возвращает карточку по ее id.
- setCards(items: ICard[]): void - заменяет текущий каталог товаров новым массивом.
- clearBasket() - полностью очищает корзину.
- addBasket(card: ICard): boolean - добавляет товар в корзину, если его там нет.
- removeBasket(card: ICard): void - удаляет товар из корзины. 
- clearOrder() - сбрасывает данные заказа к начальным значениям.
- getTotal(): number - считает общую стоимость товаров в корзине.
- hasCardInBasket(cardId: string): boolean - проверяет, есть ли товар в корзине.
- setOrderField(field: keyof OrderField, value: string): void - устанавливает значение поля (адрес, email и т.д.).
- validateOrder() - проверяет заполнение полей заказа (адрес, способ оплаты).
- validateContacts() - проверяет заполнение контактных данных (телефон, email).
- validateOrderField() - запускает обе валидации (заказ + контакты).
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Базовый Класс Component
Абстрактный базовый класс-дженерик, являющийся родительским для всех компонентов слоя представления (View).
В конструктор принимает HTMLElement — корневой DOM-элемент, служащий контейнером для компонента.
Методы: 
- render - главный метод для обновления компонента.
- toggleClass - переключает CSS-класс на элементе.
- setText - устанавливает текстовое содержимое элемента.
- setImage - обновляет src и alt (опционально) для изображения.
- setHidden - скрывает элемент.
- setVisible - показывает элемент.
- setEnabled - управляет атрибутом disabled (активация/деактивация элемента).

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна.
- open - метод открытия модального окна.
- close - метод закрытия модального окна.

Поля класса:
- modalCloseButton: HTMLButtonElement - кнопка закрытия.
- modalContent: HTMLElement - rонтейнер контента.
- events: IEvents - брокер событий.

Конструктор:
- constructor(container: HTMLElement, events: IEvents): 
    Получает ссылки на DOM-элементы;
    Устанавливает обработчики

Сеттер для обновления контента. Полностью заменяет содержимое контейнера на переданный элемент.

#### Класс Basket
Основные фунции:
- Отображение списка товаров в корзине.
- Управление состоянием кнопки оформления заказа.
- Отображение общей суммы.
- Взаимодействие с другими компонентами через систему событий.

Поля класса:
- basketList: HTMLElement - контейнер для списка товаров.
- basketTotal: HTMLElement - элемент для отображения суммы.
- basketButton: HTMLButtonElement - кнопка оформления заказа.
- events: IEvents - брокер событий.

Конструктор (container: HTMLTemplateElement, events: IEvents):
- Инициализирует DOM-элементы (basketList/basketTotal/basketButton).
- Инициализирует пустую корзину.
- Настраивает обработчик событий.

Сеттеры и геттеры:
- items - oбновляет список товаров в корзине, управляет состоянием кнопки оформления заказа.
- total - устанавливает общую сумму заказа, использует метод setText из родительского класса Component.

#### Класс Card
Поля класса:
- events: IEvents - брокер событий.
- cardId: string - внутренний id товара.
- cardTitle: HTMLElement - элемент заголовка.
- cardPrice: HTMLElement - элемент цены.
- cardImage?: HTMLImageElement - изображение товара (опционально).
- cardCategory?: HTMLElement - категория (опционально).
- cardIndex?: HTMLElement - номер в корзине (опционально).
- cardDescription?: HTMLElement - описание (опционально).
- cardButton?: HTMLButtonElement - кнопка "Купить/Удалить" (опционально).
- cardDeleteButton?: HTMLButtonElement - кнопка удаления (опционально).
- cardInBasket?: boolean - флаг наличия в корзине.

Конструктор (container: HTMLElement, events: IEvents):
- Инициализирует DOM-элементы.
- настраивает обработчики событий.

Сеттеры и геттеры:
- set id(value: string) - устанавливает data-id контейнера.
- get id(): string - возвращает ID из data-id.
- set title(value: string) - обновляет текст заголовка.
- get title(): string - возвращает текущий заголовок.
- set description(value: string) - устанавливает описание товара.
- set category(value: string) - задает категорию и обновляет элемент.
- get category(): string - возвращает текущую категорию.
- set image(value: string) - устанавливает src изображения, используя alt=title.
- set price(value: number | null) / get price(): number | null - работа с ценой.
- set inBasket(value: boolean) / get inBasket(): boolean - работает со состоянием корзины.

Методы:
- setCardIndex(index: number): void - устанавливает порядковый номер в корзине.
- updateButtonState(enabled: boolean, text: string): void - обновляет состояние кнопки.

#### Класс Form
Поля класса:
- events: IEvents - брокер событий.
- submitButton: HTMLButtonElement - кнопка отправки.
- formErrors: HTMLElement - контейнер для ошибок.

Конструктор (protected container: HTMLFormElement, events: IEvents):
- Инициализирует DOM-элементы.
- настраивает обработчики событий.

Сеттеры и геттеры:
- set valid(value: boolean) - блокирует/разблокирует кнопку отправки.
- set error(value: string) - отображает текст ошибки в форме.

Методы:
- emitFieldChangeEvent(field: keyof T, value: string) - генерирует событие изменения поля.

#### Класс Order
Класс для отображение форм оплаты.

Поля класса:
- paymentButtons: HTMLButtonElement[] - все кнопки выбора оплаты.
- orderButton: HTMLButtonElement - кнопка перехода к контактам.

Конструктор (container: HTMLFormElement, events: IEvents):
- Инициализирует DOM-элементы.
- настраивает обработчики событий.

Сеттеры и геттеры:
- set payment(name: string) - обновляет состояние кнопок оплаты.
- set address(value: string) - заполняет поле адреса.

#### Класс Contact 
Класс для отображение форм контактов.

Конструктор (container: HTMLFormElement, events: IEvents):
- Инициализирует DOM-элементы.
- настраивает обработчики событий.

Сеттеры и геттеры:
- set email(value: string) - заполняет поле email.
- set phone(value: string) - заполняет поле телефона.

#### Класс Page
Отвечает за отображение главной страницы.

Поля класса:
- pageCounter: HTMLElement - счетчик товаров в корзине.
- pageGallery: HTMLElement - контейнер для галереи товаров.
- pageBasket: HTMLElement - кнопка/иконка корзины.
- pageWrapper: HTMLElement - основной wrapper страницы.

Конструктор (container: HTMLElement, protected events: IEvents):
- Инициализирует DOM-элементы.
- настраивает обработчики событий.

Сеттеры и геттеры:
- set counter(value: number) - обновляет счетчик корзины в header.
- set gallery(items: HTMLElement[]) - заполняет галерею товарами (принимает готовые DOM-элементы).
- set locked(value: boolean) - блокирует прокрутку страницы (для модальных окон).

#### Класс Success
Отвечает за отображение окна о успешном оформление заказа.

Поля класса:
- events: IEvents - брокер событий.
- successButton: HTMLButtonElement - кнопка закрытия. 
- descriptionTotal: HTMLElement - блок для отображения суммы.

Конструктор (container: HTMLElement, events: IEvents):
- Инициализирует DOM-элементы.
- настраивает обработчики событий.

Сеттеры и геттеры:
- set total(total: number) - форматирует строку с динамическим значением суммы.

### Слой коммуникации

#### Класс ShopApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Файл `index.ts` выполняет роль презентера, организуя взаимодействие между компонентами системы через событийную модель.\
При помощи брокера событий и обработчиков этих событий, которые описаны в `index.ts`, генерируются события.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\

*События изменения данных (генерируются классами моделями данных)*
- 'items:updated' - событие обновления массива товаров.
- 'card:selected' - событие изменения выбранной карточки товара для отображения в модальном окне.
- 'basket:remove' - событие удаления товара из корзины.
- 'basket:reset' - событие полной очистки корзины.
- 'order:statusChange' - событие изменения статуса заказа.
- 'contacts:statusChange' - событие изменения статуса контактных данных контактов.

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- 'modal:open' - событие открытия модального окна.
- 'modal:close' - событие закрытия модального окна.
- 'card:select' - событие выбора карточки товара.
- 'basket:open' - событие открытия корзины.
- 'card:add' - событие добавления товара в корзину.
- 'card:remove' - событие удаления товара из корзины.
- 'order:open' - событие открытия формы заказа.
- 'order:change' - событие изменения данных в форме заказа.
- 'contacts:change' - событие изменения данных в форме контактов.
- 'contacts:open' - событие открытия формы контактов.
- 'contacts:submit' - событие отправки контактов.
- 'success:close' -  событие закрытия окна с подтверждением успешного заказа.

// Интерфейс карточки товара
export interface ICard {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
    inBasket?: boolean;
}

// Интерфейс отображение главной страницы
export interface IPage {
    counter: number;
    gallery: ICard[];
    locked: boolean;
}

// Интерфейс отображение корзины
export interface IBasket {
    items: ICard[];
    total: number;
}

// Интерфейс ответа API для списка товаров
export interface ICards {
    total: number;
    items: ICard[];
}

// Интерфейс модели данных магазина
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

// Интерфейс статуса заказа (валидации)
export interface IOrderStatus {
    status: boolean;
    message: string;
}

// Интерфейс отображение оплаты
export interface IOrder {
    payment: string;
    address: string;
}

// Интерфейс отображение контактов
export interface IContact {
    email: string;
    phone: string;
}

// Интерфейс результата оформления заказа
export interface IOrderResult {
    id?: string;
    total?: number;
}

// Объединенный тип для полей заказа и контактов
export type OrderField = IOrder & IContact;

// Полный интерфейс данных заказа
export interface IOrderData extends OrderField {
    items: string[];
    total: number;
}

// Тип для ошибок формы
export type FormErrors = Partial<Record<keyof IOrderData, string>>;

// Тип для HTTP методов POST, PUT, DELETE
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Интерфейс API магазина
export interface IShopApi {
    baseUrl: string;
    cdnUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
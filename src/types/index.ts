import { API_URL } from "../utils/constants";

export interface ICard {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICards {
    item: ICard[]
}

export interface IShopsData {
    cards: ICard[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    getCard(cardId: string): ICard;
    setCard(items: ICard[]): void;
    addBasket(cardId: string): void;
    removeBasket(cardId: string): void;
    setOrderField(field: keyof OrderField, value: string): void;
    getTotal?(): number;
}

// // производный тип способ оплаты
// export type PaymentMethod = 'online' | 'upon receipt';

// Интерфейс модального окна оплаты
export interface IDelivery {
    payment: string;
    address: string;
}

// Интерфейс модального окна контактов
export interface IContact {
    email: string;
    phone: string;
}

// Интерфейс модального окна заказ оформлен
export interface IOrderResult {
    id: string;
    total: number;
}

// производный тип оплаты и контактов
export type OrderField = IDelivery & IContact;

// // производный тип форм оплаты и контактов
// export type OrderForm = Pick<UserData, 'address' | 'email' | 'phone'>

// Интерфейс модального окна контактов
export interface IOrder extends OrderField {
    items: string[]
}

// производный тип объекта для хранения ошибок валидации формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// производный тип товара в карзине
export type CardBasket = Pick<ICard, 'id' | 'title' | 'price'>

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IShopApi {
    baseUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

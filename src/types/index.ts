import { API_URL } from "../utils/constants";

export interface ICard {
    id: string;
    description?: string;
    image?: string;
    title: string;
    category?: string;
    price: number | null;
}

export interface IPage {
    counter: number;
    gallery: ICard[];
    locked: boolean;
}

export interface IBasket {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface ICards {
    total: number;
    items: ICard[]
}

export interface IShopsData {
    cards: ICard[];
    basket: ICard[];
    preview: string | null;
    order: IOrder | null;
    // getCard(cardId: string): ICard;
    setCards(items: ICard[]): void;
    addBasket(card: ICard): void;
    removeBasket(card: ICard): void;
    setOrderField(field: keyof OrderField, value: string): void;
    getTotal?(): number;
}

// // производный тип способ оплаты
// export type PaymentMethod = 'online' | 'upon receipt';

export interface IOrderStatus {
    status: boolean;
    message: string;
}

export interface IDelivery {
    payment: string;
    address: string;
}

export interface IContact {
    email: string;
    phone: string;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type OrderField = IDelivery & IContact;

// // производный тип форм оплаты и контактов
// export type OrderForm = Pick<UserData, 'address' | 'email' | 'phone'>

export interface IOrder extends OrderField {
    items: string[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type CardBasket = Pick<ICard, 'id' | 'title' | 'price'>

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IShopApi {
    baseUrl: string;
    cdnUrl: string;
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

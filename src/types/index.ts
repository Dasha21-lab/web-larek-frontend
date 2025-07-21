// import { API_URL } from "../utils/constants";

// // Интерфейс карточки
// export interface ICard {
//     id: string;
//     description?: string;
//     image: string;
//     title: string;
//     category: string;
//     price: number | null;
// }

// // Интерфейс карточки с выделение одной
// export interface ICardsData {
//     card: ICard[];
//     preview: string | null;
//     addCard(card: ICard): void;
//     deleteCard(cardId: string, payload: Function | null): void;
//     updateCard(card: ICard, payload: Function | null): void;
//     getCard(cardId: string): ICard;
//     totalCard(): void;
// }

// // export interface ICardsData


// // производный тип способ оплаты
// export type PaymentMethod = 'online' | 'upon receipt';

// // Интерфейс модального окна оплаты
// export interface IDelivery {
//     payment: PaymentMethod;
//     address: string;
// }

// // Интерфейс модального окна контактов
// export interface IContact {
//     email: string;
//     phone: string;
// }

// // Интерфейс модального окна заказ оформлен
// export interface IOrderResult {
//     id: string;
//     total: number;
// }

// // производный тип оплаты и контактов
// export type UserData = IDelivery & IContact;

// // производный тип форм оплаты и контактов
// export type OrderForm = Pick<UserData, 'address' | 'email' | 'phone'>

// // Интерфейс модального окна контактов
// export interface IOrder extends Pick<UserData, 'address' | 'email' | 'phone'> {
//     items: string[];
// }

// // производный тип объекта для хранения ошибок валидации формы
// export type FormErrors = Partial<Record<keyof IOrder, string>>;

// // производный тип товара в карзине
// export type CardBasket = Pick<ICard, 'id' | 'title' | 'price'>


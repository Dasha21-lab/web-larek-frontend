import { ICard, IShopsData, IOrder, FormErrors, OrderField } from '../types';
import { IEvents } from "./base/events";

export type Test = {
   items: ICard[];
}

export class ShopData implements IShopsData {
    protected _cards: ICard[];
    protected _basket: string[];
    protected _preview: string | null;
    protected events: IEvents;
    protected _order: IOrder | null = {
        payment: null,
        address: '',
        email: '',
        phone: '',
        items: []
    };
    protected formErrors: FormErrors = {};

    constructor(events: IEvents) {
        this.events = events;
    }

    set cards(cards: ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed', this._cards);
    }

    get cards() {
        return this._cards;
    }

    get basket(): string[] {
        return this._basket;
    }

    get order(): IOrder | null {
        return this._order;
    }

    set preview(cardId: string | null) {
        if (!cardId) {
            this._preview = null;
            return;
        }
        const selectedCard = this.getCard(cardId);

        if (selectedCard) {
            this._preview = cardId;
            this.events.emit('card:selected');
        }
    }

    get preview(): string | null {
        return this._preview;
    }

    getCard(cardId: string): ICard | undefined {
        return this._cards.find((item) => item.id === cardId);
    }

    setCard(items: ICard[]) {
        this._cards = items;
        this.events.emit('items:changed', { _cards: this._cards});
    }

    clearBasket() {
        this._basket = [];
        this.events.emit('basket:changed', this._basket);
    }

    addBasket(cardId: string) {
        if (!this._basket.includes(cardId)) {
            this._basket.push(cardId);
            this.events.emit('basket:changed', this._basket);
        }
    }

    removeBasket(cardId: string) {
        this._basket = this._basket.filter(id => id !== cardId);
        this.events.emit('basket:changed', this._basket);
    }

    getTotal(): number {
        return this._basket.reduce((a, c) => a + this._cards.find(it => it.id === c).price, 0)
    }

    setOrderField(field: keyof OrderField, value: string) {
        this._order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this._order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};

        if (!this._order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }

        if (!this._order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this._order.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this._order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

   
}
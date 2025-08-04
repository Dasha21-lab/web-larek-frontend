import { ICard, IShopsData, IOrderData, FormErrors, OrderField, IOrderStatus } from '../types';
import { IEvents } from '../components/base/events';

export class ShopData implements IShopsData {
    protected _cards: ICard[];
    protected _basket: ICard[] = [];
    protected _preview: string | null;
    protected _order: IOrderData | null = {
        payment: null,
        address: '',
        email: '',
        phone: '',
        items: [],
        total: 0
    };
    formErrors: FormErrors = {};

    constructor(protected events: IEvents) {
        this.events = events;
    }

    get basketCount(): number {
        return this._basket.length;
    }

    get cards() {
        return this._cards;
    }

    get basket(): ICard[] {
        return this._basket;
    }

    get order(): IOrderData | null {
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
            this.events.emit('card:selected', selectedCard);
        }
    }

    get preview(): string | null {
        return this._preview;
    }

    getCard(cardId: string): ICard | undefined {
        return this._cards.find((item) => item.id === cardId);
    }

    // обновляет массив карточек
    setCards(items: ICard[]): void {
        this._cards = items;
        this.events.emit('items:updated', { _cards: this._cards });
    }

    // выполняет очистку корзины
    clearBasket() {
        this._basket = [];
        this.events.emit('basket:reset');
    }

    // добавляет товар в корзину
    addBasket(card: ICard): boolean {
        if (!this._basket.some(item => item.id === card.id)) {
            this._basket.push(card);
            return true;
        }

        return false;
    }

    clearOrder() {
        this._order = {
            payment: null,
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0,
        };
    }

    removeBasket(card: ICard): void {
        this._basket = this._basket.filter(item => item.id !== card.id);
        this.events.emit('basket:remove', this._basket);
    }

    getTotal(): number {
        return this._basket.reduce((total, card) => {
            return total + (card.price || 0);
        }, 0);
    }

    hasCardInBasket(cardId: string): boolean {
        return this.basket.some((card: ICard) => card.id === cardId);
    }

    protected validateOrder() {
        let orderStatus: IOrderStatus = {status: true, message: ''};

        if (!this._order.address) {
            orderStatus.message = 'Необходимо указать адрес';
            orderStatus.status = false;
        }

        if (!this._order.payment) {
            orderStatus.message = 'Необходимо указать способ оплаты';
            orderStatus.status = false;
        }

        this.events.emit('order:statusChange', orderStatus);
    }

    protected validateContacts() {
        let orderStatus: IOrderStatus = {status: true, message: ''};

        if (!this._order.phone) {
            orderStatus.message = 'Необходимо указать телефон';
            orderStatus.status = false;
        }

        if (!this._order.email) {
            orderStatus.message = 'Необходимо указать email';
            orderStatus.status = false;
        }

        this.events.emit('contacts:statusChange', orderStatus);
    }

    setOrderField(field: keyof OrderField, value: string): void {
        this._order[field] = value;

        this.validateOrderField();
    }

    protected validateOrderField() {
        this.validateOrder();
        this.validateContacts();
    }
}
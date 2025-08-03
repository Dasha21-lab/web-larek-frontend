import { ICard, IShopsData, IOrder, FormErrors, OrderField, IOrderStatus } from '../types';
import { IEvents } from "./base/events";

export class ShopData implements IShopsData {
    protected _cards: ICard[];
    protected _basket: ICard[] = [];
    protected _preview: string | null;
    protected _order: IOrder | null = {
        payment: null,
        address: '',
        email: '',
        phone: '',
        items: []
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
    setCards(items: ICard[]) {
        this._cards = items;
        this.events.emit('items:updated', { _cards: this._cards });
    }

    // выполняет очистку корзины
    clearBasket() {
        this._basket = [];
        this.events.emit('basket:change', this._basket);
    }
    
    // добавляет товар в корзину
    addBasket(card: ICard) {
        if (!this._basket.some(item => item.id === card.id)) {
            this._basket.push(card);
        //    this.events.emit('basket:add', this._basket);
        }
    }

    removeBasket(card: ICard) {
        this._basket = this._basket.filter(item => item.id !== card.id);
        this.events.emit('basket:remove', this._basket);
    }

    getTotal(): number {
       return this._basket.reduce((total, card) => {
        // Обрабатываем случай, когда price может быть null
        return total + (card.price || 0);
    }, 0);
    }

    setOrderField(field: keyof OrderField, value: string) {
        this._order[field] = value;

        const isValid = this.validateOrder();

        if (isValid) {
            this.events.emit('order:ready', this._order);
        }
    }



    /*
    validateOrder() {
        const orderStatus: Partial<Record<keyof IOrderStatus, string>> = {};

        if (!this._order.payment) {
            orderStatus.
            orderStatus.message = 'Необходимо указать способ оплаты';
        }

        if (!this._order.address) {
            orderStatus.address = 'Необходимо указать адрес';
        }

        if (!this._order.email) {
            orderStatus.email = 'Необходимо указать email';
        }

        if (!this._order.phone) {
            status.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
        */

    
    // validateOrder() {
    //     const errors: typeof this.formErrors = {};

    //     if (!this._order.payment) {
    //         errors.payment = 'Необходимо указать способ оплаты';
    //     }

    //     if (!this._order.address) {
    //         errors.address = 'Необходимо указать адрес';
    //     }

    //     if (!this._order.email) {
    //         errors.email = 'Необходимо указать email';
    //     }

    //     if (!this._order.phone) {
    //         errors.phone = 'Необходимо указать телефон';
    //     }

    //     this.formErrors = errors;
    //     this.events.emit('formErrors:change', this.formErrors);
    //     return Object.keys(errors).length === 0;
    // }

        validateOrder() {
        const errors: typeof this.formErrors = {};
        const { payment, address, email, phone } = this._order;

        if (!payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }

        if (!address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!email) {
            errors.email = 'Необходимо указать email';
        }

        if (!phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    hasCardInBasket(cardId: string): boolean {
        return this.basket.some(basketItem => basketItem.id === cardId);
    }
}

//  removeBasket(card: ICard): boolean {
// //     const initialLength = this._basket.length;
    
// //     // Фильтруем корзину, оставляя только элементы с несовпадающими id
// //     this._basket = this._basket.filter(item => item.id !== card.id);
    
// //     // Если количество элементов изменилось - значит удаление произошло
// //     const wasRemoved = this._basket.length < initialLength;
    
// //     if (wasRemoved) {
// //         // Отправляем событие с обновленной корзиной
// //         this.events.emit('basket:changed', {
// //             type: 'removed',
// //             item: card,
// //             basket: this._basket
// //         });
        
// //         // Можно добавить дополнительное специфичное событие
// //         this.events.emit('basket:item_removed', card);
// //     }
    
// //     return wasRemoved;
// // }

//     // removeBasket(card: ICard): boolean {
//     //     const itemExists = this._basket.some(item => item.id === card.id);
    
//     //     if (!itemExists) {
//     //         return false;
//     //     }
    
//     //     this._basket = this._basket.filter(item => item.id !== card.id);
//     //     // this.events.emit('basket:remove', this._basket);
    
//     //     return true;
//     // }

//     // updateBasket(cardId: string, action: 'add' | 'remove') {
//     // if (action === 'add' && !this._basket.includes(cardId)) {
//     //     this._basket.push(cardId);
//     // } else if (action === 'remove') {
//     //     this._basket = this._basket.filter(id => id !== cardId);
//     // }
//     // this.events.emit('basket:changed', this._basket);
//     // }

import { ICard, ICardsData } from '../types';
import { IEvents } from "./base/events";

export class CardData implements ICardsData {
    protected _cards: ICard[];
    protected _preview: string | null;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set cards(cards: ICard[]) {
        this._cards = cards;
        this.events.emit('cards:changed');
    }

    get cards() {
        return this._cards;
    }

    addCard(card: ICard) {
        this._cards.push(card);
        this.events.emit('cards:changed');
    }

    updateCard(card: ICard, payload: Function | null = null) {
        const foundCard = this._cards.find((item) => item.id === card.id);
        if (!foundCard) {
            this.addCard(card);
        } else {
            Object.assign(foundCard, card);
        }
        payload?.();
        this.events.emit('cards:changed');
    }

    getCard(cardId: string): ICard | undefined {
        return this._cards.find((item) => item.id === cardId);
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

    get preview() {
        return this._preview;
    }
}
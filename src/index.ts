import { EventEmitter, IEvents } from './components/base/events';
// import { ICard } from './types/index';
import './scss/styles.scss';

export interface ICard {
    id: string;
    description?: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICardsData {
    cards: ICard[];
    preview: string | null;
    updateCard(card: ICard, payload: Function | null): void;
    getCard(cardId: string): ICard;
}

export class CardData implements ICardsData {
    protected _cards: ICard[] = [];
    protected _preview: string | null = null;
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

const events: IEvents = new EventEmitter();

const cardsData = new CardData(events);

const test = {
    "items": [
        {
            "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
            "description": "Если планируете решать задачи в тренажёре, берите два.",
            "image": "/5_Dots.svg",
            "title": "+1 час в сутках",
            "category": "софт-скил",
            "price": 750
        },
        {
            "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
            "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
            "image": "/Shell.svg",
            "title": "HEX-леденец",
            "category": "другое",
            "price": 1450
        },
        {
            "id": "b06cde61-912f-4663-9751-09956c0eed67",
            "description": "Будет стоять над душой и не давать прокрастинировать.",
            "image": "/Asterisk_2.svg",
            "title": "Мамка-таймер",
            "category": "софт-скил",
            "price": null
        },
        {
            "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
            "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
            "image": "/Soft_Flower.svg",
            "title": "Фреймворк куки судьбы",
            "category": "дополнительное",
            "price": 2500
        },
        {
            "id": "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
            "description": "Если орёт кот, нажмите кнопку.",
            "image": "/mute-cat.svg",
            "title": "Кнопка «Замьютить кота»",
            "category": "кнопка",
            "price": 2000
        }
    ]
}

cardsData.cards = test.items;

console.log(cardsData.getCard("854cef69-976d-4c2a-a18c-2aa45046c390"))



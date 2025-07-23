import { IEvents } from '../components/base/events';
import { ICard } from '../types/index';
import { Component } from '../components/base/Component';
import { cloneTemplate, ensureElement } from '../utils/utils'


export class Card extends Component<ICard> {
    protected container: HTMLElement;
    protected events: IEvents;
    protected cardId: string;
    protected cardImage?: HTMLImageElement;
    protected cardTitle: HTMLElement;
    protected cardCategory?: HTMLElement;
    protected cardDescription?: HTMLElement;
    protected cardButton?: HTMLButtonElement;
    protected cardPrice: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement) {
        super(container);
    

        this.cardImage = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this.cardTitle = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this.cardCategory = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        this.cardDescription = container.querySelector(`.${blockName}__text`);
        this.cardButton = container.querySelector('.button');
        this.cardPrice = ensureElement<HTMLElement>(`.${blockName}__price`, container);

        this.cardButton.addEventListener('click', () =>
            this.events.emit('card:select', { card: this })
        )
    }

    set id(value: string) {
        this.cardId = value;
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.cardId || this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this.cardTitle, value);
    }

    get title(): string {
        return this.cardTitle.textContent || '';
    }

    set image(value: string) {
        this.setImage(this.cardImage, value, this.title);
    }

    set description(value: string) {
        this.setText(this.cardDescription, value);
    }

    set category(value: string) {
        this.setText(this.cardCategory, value);
    }
    
    get category(): string {
        return this.cardCategory?.textContent || '';
    }

    set price(value: number | null) {
        if(value === null) {
            this.setText(this.cardPrice, 'Бесценно');
            this.updateButton(false, 'Недоступно');
        } else {
            this.setText(this.cardPrice, `${value} синапсов`);
            this.updateButton(true, 'Купить');
        }
    }

    protected updateButton(enabled: boolean, text: string) {
        this.setText(this.cardButton, text);
        this.setEnabled(this.cardButton, !enabled);
            
        this.toggleClass(this.cardButton, 'card__button_disabled', !enabled);
    }

    get price(): number | null {
        return +this.cardPrice?.textContent || 0;
    }
}


import { IEvents } from '../components/base/events';
import { ICard } from '../types/index';
import { Component } from '../components/base/Component';
import { ensureElement } from '../utils/utils'

export class Card extends Component<ICard> {
    protected events: IEvents;
    protected cardId: string;
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
    protected cardImage?: HTMLImageElement;
    protected cardCategory?: HTMLElement;
    protected cardIndex?: HTMLElement;
    protected cardDescription?: HTMLElement;
    protected cardButton?: HTMLButtonElement;
    protected cardDeleteButton?: HTMLButtonElement;
    protected cardInBasket?: boolean;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.cardTitle = ensureElement<HTMLElement>('.card__title', container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', container);
        this.cardImage = container.querySelector('.card__image');
        this.cardCategory = container.querySelector('.card__category');
        this.cardIndex = container.querySelector('.basket__item-index');
        this.cardDescription = container.querySelector('.card__text');
        this.cardButton = container.querySelector('.button');
        this.cardDeleteButton = container.querySelector('.basket__item-delete');

        if (this.cardButton) {
            this.cardButton.addEventListener('click', () =>
                this.inBasket
                    ? this.handleRemove()
                    : this.events.emit('card:add', this)
            );
        }

        this.cardDeleteButton
            ? this.cardDeleteButton.addEventListener('click', () =>
                this.handleRemove())
            : this.container.addEventListener('click', () =>
                this.events.emit('card:select', this))
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this.cardTitle, value);
    }

    get title(): string {
        return this.cardTitle.textContent || '';
    }

    set image(value: string) {
        if (this.cardImage) {
            this.setImage(this.cardImage, value, this.title);
        }
    }

    set description(value: string) {
        if (this.cardDescription) {
            this.setText(this.cardDescription, value);
        }
    }

    set category(value: string) {
       if (this.cardCategory) {
            this.setText(this.cardCategory, value);
        }
    }

    get category(): string {
        return this.cardCategory?.textContent || '';
    }

    set price(value: number | null) {
        value === null
            ? this.setText(this.cardPrice, 'Бесценно')
            : this.setText(this.cardPrice, `${value} синапсов`);
    }

    get price(): number | null {
        const text = this.cardPrice?.textContent;

        if (text === 'Бесценно') return null;
        return Number(text?.replace(' синапсов', '')) || null;
    }

    set inBasket(value: boolean) {
        if (this.price === null) {
            this.updateButtonState(false, 'Недоступно');
            return;
        }

        const content = value
            ? 'Удалить из корзины'
            : 'Купить';

        this.cardInBasket = value;
        this.updateButtonState(true, content);
    }

    get inBasket(): boolean {
        return this.cardInBasket;
    }

    setCardIndex(index: number): void {
        if (this.cardIndex) {
            this.cardIndex.textContent = index.toString();
        }
    }

    protected handleRemove() {
        this.events.emit('card:remove', this);
    }

    protected updateButtonState(enabled: boolean, text: string): void {
        if (!this.cardButton) return;

        this.setText(this.cardButton, text);
        this.setEnabled(this.cardButton, !enabled);

        this.toggleClass(this.cardButton, 'card__button_disabled', !enabled);
    }
}
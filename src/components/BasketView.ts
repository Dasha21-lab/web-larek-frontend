import { createElement, ensureElement } from '../utils/utils';
import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/events';
import { IBasket } from '../types/index'

export class Basket extends Component<IBasket> {
    protected events: IEvents;
    protected basketList: HTMLElement;
    protected basketTotal: HTMLElement;
    protected basketButton: HTMLButtonElement;

    constructor(container: HTMLTemplateElement, events: IEvents) {
        super(container);
        this.events = events;

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotal = container.querySelector('.basket__price');
        this.basketButton = container.querySelector('.basket__button');

        this.basketButton.addEventListener('click', () => {
            events.emit('order:open');
        });

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.basketList.replaceChildren(...items);
        } else {
            this.basketList.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста'
            }));
        };

        this.setEnabled(this.basketButton, items.length > 0);
        this.basketButton.disabled = items.length
            ? false
            : true;
    }

    set total(total: number) {
        this.setText(this.basketTotal, `${total.toString()} синапсов`);
    }
}
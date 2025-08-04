import { Component } from '../components/base/Component';
import { IOrderResult } from '../types/index';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Success extends Component<IOrderResult> {
    protected events: IEvents;
    protected successButton: HTMLButtonElement;
    protected descriptionTotal: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.successButton = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.descriptionTotal = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.successButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(total: number) {
        this.setText(this.descriptionTotal, `Списано ${total.toString()} синапсов`);
    }
}
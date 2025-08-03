import { Component } from '../components/base/Component';
import { IOrderResult } from '../types/index';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Success extends Component<IOrderResult> {
    protected succesButton: HTMLButtonElement;
    protected descriptionTotal: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.succesButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.descriptionTotal = ensureElement<HTMLElement>('.order-success__description', this.container);

        this.succesButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });
    }

    set total(total: number) {
        this.setText(this.descriptionTotal, `Списано ${total.toString()} синапсов`);
    }
}

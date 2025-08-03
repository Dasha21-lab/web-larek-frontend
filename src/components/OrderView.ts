import { IDelivery, IContact  } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./Form";

export class Delivery extends Form<IDelivery> {
    protected paymentButtons: HTMLButtonElement[];
    protected _button: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.paymentButtons = Array.from(this.container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
        this._button = ensureElement<HTMLButtonElement>('.order__button', this.container);
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('contacts:open');
            });
        };
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                this.emitFieldChangeEvent('payment', button.name);
            });
        })
    }

    set payment(name: string) {
        this.paymentButtons.forEach(button => {
             const isActive = button.name === name;
            this.toggleClass(button, 'button_alt-active', isActive);
            button.ariaPressed = String(isActive);
        });
    }
    
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}

export class Contact extends Form<IContact> {
    protected _button: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    this._button = ensureElement<HTMLButtonElement>('.button', this.container);
 if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('success:open');
            });
        };
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

}
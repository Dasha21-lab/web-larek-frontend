import { IOrder } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./Form";

export class Order extends Form<IOrder> {
    protected paymentButtons?: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.paymentButtons = Array.from(this.container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
        
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                this.emitFieldChangeEvent('payment', button.name);
            });
        })
    }

    set payment(name: string) {
        console.log(name)
        this.paymentButtons.forEach(button => {
             const isActive = button.name === name;
            this.toggleClass(button, 'button_alt-active', isActive);
            button.ariaPressed = String(isActive);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}
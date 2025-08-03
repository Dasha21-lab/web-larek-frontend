import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IForm {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IForm> {
    protected events: IEvents;
    protected submitButton: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(protected container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });

        this.container.addEventListener('input', (event: Event) => {
            const target = event.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            
            this.emitFieldChangeEvent(field, value);
        });
    }

    set valid(value: boolean) {
        // this.submitButton.disabled = !value;
        if (!value) {
 this.setEnabled(this.submitButton, false); 
        }
         
    }

    set errors(value: string) {
        this.setText(this.formErrors, value)
    }

    protected emitFieldChangeEvent(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}:change`, {
            field, value
        });
    }

    render(state: Partial<T> & IForm) {
        const {valid, errors, ...inputs} = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);
        return this.container;
    }
}
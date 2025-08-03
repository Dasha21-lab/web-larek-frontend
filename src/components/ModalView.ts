
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected events: IEvents;
    protected modalCloseButton: HTMLButtonElement;
    protected modalContent: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.modalContent = ensureElement<HTMLElement>('.modal__content', container);

        this.modalCloseButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.modalContent.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(value: HTMLElement) {
        this.modalContent.replaceChildren(value);
    }
    
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    render(data: IModal): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}

// if(this.modalActionsButton) {
        // this.modalActionsButton.addEventListener('click', (event: Event) => {
        //     event.preventDefault();
        //      const modalType = this.getModalName();
        //     this.events.emit(`${modalType}:open`);
           
        // })
        // }

        // protected getModalName(): string {
    //     if (this.container.querySelector('.basket')) {
    //         return 'basket';
    //     } else if (this.container.querySelector('.order')) {
    //         return 'order';
    //     } else if (this.container.querySelector('.contacts')) {
    //         return 'contacts';
    //     }
    //     return 'modal';
    // }
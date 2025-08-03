import { IPage } from '../types/index';
import { ensureElement } from '../utils/utils';
import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/events';

export class Page extends Component<IPage> {
    protected pageCounter: HTMLElement;
    protected pageGallery: HTMLElement;
    protected pageBasket: HTMLElement;
    protected pageWrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.pageCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this.pageGallery = ensureElement<HTMLElement>('.gallery');
        this.pageBasket = ensureElement<HTMLElement>('.header__basket');
        this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');

        this.pageBasket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this.pageCounter, String(value));
    }

    set gallery(items: HTMLElement[]) {
        this.pageGallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this.pageWrapper.classList.add('page__wrapper_locked');
        } else {
            this.pageWrapper.classList.remove('page__wrapper_locked');
        }
    }
}
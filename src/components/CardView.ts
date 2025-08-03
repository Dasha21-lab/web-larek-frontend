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

    constructor(container: HTMLTemplateElement, events: IEvents) {
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
                this.events.emit('card:add', this)
            );
        }
        
        if (this.cardDeleteButton) {
            this.cardDeleteButton.addEventListener('click', () => {
                this.events.emit('card:remove', this)
            });
        } else {
            this.container.addEventListener('click', () => {
                this.events.emit('card:select', this)
            });
        }
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
        if(value === null) {
            this.setText(this.cardPrice, 'Бесценно');
            this.updateButton(false, 'Недоступно');
        } else {
            this.setText(this.cardPrice, `${value} синапсов`);
            this.updateButton(true, 'Купить');
        }
    }

    get price(): number | null {
        const text = this.cardPrice?.textContent;

        if (text === 'Бесценно') return null;
        return Number(text?.replace(' синапсов', '')) || null;
    }

    // set buttonText(value: string) {
    //     if (this.cardButton) {
    //         this.setText(this.cardButton, value);
    //     }
    // }

    setCardIndex(index: number): void {
        if (this.cardIndex) {
            this.cardIndex.textContent = index.toString();
        }
    }

    protected updateButton(enabled: boolean, text: string): void {
        if (!this.cardButton) return;

        this.setText(this.cardButton, text);
        this.setEnabled(this.cardButton, !enabled);
            
        this.toggleClass(this.cardButton, 'card__button_disabled', !enabled);
    }
}

// export class Card extends Component<ICard> {
//     protected container: HTMLElement;
//     protected events: IEvents;
//     protected cardId: string;
//     protected cardImage?: HTMLImageElement;
//     protected cardTitle: HTMLElement;
//     protected cardCategory?: HTMLElement;
//     protected cardDescription?: HTMLElement;
//     protected cardButton?: HTMLButtonElement;
//     protected cardPrice: HTMLElement;
//     protected cardIndex?: HTMLElement;
//     protected cardButtonDelete?: HTMLButtonElement;
//     protected isInBasket: boolean;

//     constructor(container: HTMLTemplateElement, events: IEvents) {
//         super(container);
//         this.events = events;

//         this.cardImage = container.querySelector('.card__image');
//         this.cardTitle = ensureElement<HTMLElement>('.card__title', container);
//         this.cardCategory = container.querySelector('.card__category');
//         this.cardDescription = container.querySelector('.card__text');
//         this.cardButton = container.querySelector('.button');
//         this.cardPrice = ensureElement<HTMLElement>('.card__price', container);
//         this.cardIndex = this.container.querySelector('.basket__item-index');
//         this.cardButtonDelete = this.container.querySelector('.basket__item-delete');

//         // if (this.cardButton) {
//         //     this.cardButton.addEventListener('click', () => {
//         //         if (this.isInBasket) {
//         //             // Если товар в корзине, удаляем его
//         //             this.events.emit('card:due', this);
//         //             this.updateButton(true, 'Купить');
//         //         } else {
//         //             // Если товара нет в корзине, добавляем его
//         //             this.events.emit('card:add', this);
//         //             this.updateButton(true, 'Убрать из корзины');
//         //         }
//         //         this.isInBasket = !this.isInBasket; // Меняем состояние
//         //     });
//         // }
        
//         if (this.cardButtonDelete) {
//             this.cardButtonDelete.addEventListener('click', () => {
//                 this.events.emit('card:due', this);
//             });
//         } else {
//             this.container.addEventListener('click', () => {
//                 this.events.emit('card:select', this);
//             });
//         }
//     }

//      set inBasket(value: boolean) {
//         this.isInBasket = value;
//         this.updateButton(true, value ? 'Убрать из корзины' : 'Купить');
//     }


//     // Остальные методы остаются без изменений
//     setCardIndex(index: number): void {
//         if (this.cardIndex) {
//             this.cardIndex.textContent = index.toString();
//         }
//     }

//     set id(value: string) {
//         this.container.dataset.id = value;
//     }

//     get id(): string {
//         return this.container.dataset.id || '';
//     }

//     set title(value: string) {
//         this.setText(this.cardTitle, value);
//     }

//     get title(): string {
//         return this.cardTitle.textContent || '';
//     }

//     set image(value: string) {
//         if (this.cardImage) {
//             this.setImage(this.cardImage, value, this.title);
//         }
//     }

//     set description(value: string) {
//         if (this.cardDescription) {
//             this.setText(this.cardDescription, value);
//         }
//     }

//     set category(value: string) {
//        if (this.cardCategory) {
//             this.setText(this.cardCategory, value);
//         }
//     }
    
//     get category(): string {
//         return this.cardCategory?.textContent || '';
//     }

//     set price(value: number | null) {
//         if(value === null) {
//             this.setText(this.cardPrice, 'Бесценно');
//             this.updateButton(false, 'Недоступно');
//         } else {
//             this.setText(this.cardPrice, `${value} синапсов`);
//             // Учитываем состояние корзины при обновлении кнопки
//             this.updateButton(true, this.isInBasket ? 'Убрать из корзины' : 'Купить');
//         }
//     }

//     protected updateButton(enabled: boolean, text: string) {
//         if (!this.cardButton) return;

//         this.setText(this.cardButton, text);
//         this.setEnabled(this.cardButton, !enabled);
//         this.toggleClass(this.cardButton, 'card__button_disabled', !enabled);
//     }

//     get price(): number | null {
//         const text = this.cardPrice?.textContent;
//         if (text === 'Бесценно') return null;
//         return Number(text?.replace(' синапсов', '')) || null;
//     }
// }

    //  updateButtonState(isInBasket: boolean): void {
    //     if (!this.cardButton) return;
        
    //     if (isInBasket) {
    //         this.cardButton.textContent = 'Убрать из корзины';
    //         this.cardButton.classList.add('in-basket');
    //     } else {
    //         this.cardButton.textContent = 'Купить';
    //         this.cardButton.classList.remove('in-basket');
    //     }
    // }


 // updateButtonText() {
    //     this.cardButton.textContent = this.cardButton
    //     ? 'Убрать из корзины' 
    //     : 'Купить';
    // }

    // updateButtonState(isInBasket: boolean) {
    //     if (!this.cardButton) return;
        
    //      const newButton = this.cardButton.cloneNode(true) as HTMLButtonElement;
    //     this.cardButton.replaceWith(newButton);
    //     this.cardButton = newButton;

    //     const [text, event] = isInBasket 
    //         ? ['Удалить из корзины', 'card:remove'] 
    //         : ['Купить', 'card:add'];
        
    //     this.updateButton(true, text);
    //     this.cardButton.addEventListener('click', (e) => {
    //         e.stopPropagation();
    //         this.events.emit(event, this);
    //     });
    // }
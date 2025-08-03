import { EventEmitter, IEvents } from './components/base/events';
import { ICard, IShopsData, IOrder, IOrderResult, IShopApi, ICards, IDelivery, IOrderStatus, FormErrors } from './types/index';
import { Api } from './components/base/api';
import { ShopData } from './components/ShopData';
import { Card } from '../src/components/CardView';
import { ShopApi } from '../src/components/ShopApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from '../src/utils/utils';
import './scss/styles.scss';
import { Page } from '../src/components/PageView';
import { Modal } from '../src/components/ModalView'
import { Basket } from './components/BasketView';
import { Delivery, Contact } from './components/OrderView';
import { Success } from './components/SuccessView';

// Инициализация событий и API
const events = new EventEmitter();
const baseApi: IShopApi = new Api(API_URL, CDN_URL);
const api = new ShopApi(baseApi);

// Получение шаблонов
const cardCatalogemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация компонентов
const cardsData = new ShopData(events);
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Delivery(cloneTemplate(orderTemplate), events)
const contacts = new Contact(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Загрузка данных с сервера
api.getCardList()
  .then((cards) => {
    cardsData.setCards(cards.items);
  })
  .catch((err) => {
    console.error(err);
  });

// Обработчики событий

// Обновление каталога товаров
events.on<ShopData>('items:updated', () => {
  page.gallery = cardsData.cards.map((item) => {
    const catalog = new Card(cloneTemplate(cardCatalogemplate), events);
    return catalog.render({
      id: item.id,
      title: item.title,
      image: `${CDN_URL}${item.image}`,
      price: item.price,
      category: item.category,
    });
  });
});

// Просмотр товара
events.on('card:select', (item: Card) => {
  cardsData.preview = item.id;
});

events.on('card:selected', (item: Card) => {
  const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);
  
  modal.render({
    content: cardPreview.render({
      id: item.id,
      title: item.title,
      description: item.description,
      image: `${CDN_URL}${item.image}`,
      price: item.price,
      category: item.category,
    })
  });
});

// Управление модальными окнами - открытие
events.on('modal:open', () => {
    page.locked = true;
});

// Управление модальными окнами - закрытие
events.on('modal:close', () => {
    page.locked = false;
});

// открытие корзины
events.on('basket:open', () => {
  modal.render({
    content: basket.render()
  });
});

events.on('card:add', (item: Card) => {
  // Добавляем товар в корзину
  cardsData.addBasket(item);
  page.counter = cardsData.basketCount;

  // Обновляем отображение корзины
  basket.items = cardsData.basket.map((basketItem, index) => {
      const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);
      const cardElement = cardBasket.render({
        id: basketItem.id,
        title: basketItem.title,
        price: basketItem.price
      });
      
      // Устанавливаем номер позиции (начинаем с 1)
      cardBasket.setCardIndex(index + 1);
      return cardElement;
  });

  // Обновляем общую сумму
  basket.total = cardsData.getTotal();
});

events.on('card:remove', (item: Card) => {
  cardsData.removeBasket(item);
  page.counter = cardsData.basketCount;
});

events.on('basket:remove', (items: Card[]) => {
  basket.items = items.map((basketItem, index) => {
    const cardBasket = new Card(cloneTemplate(cardBasketTemplate), events);

    const cardElement = cardBasket.render({
      id: basketItem.id,
      title: basketItem.title,
      price: basketItem.price
    });

    cardBasket.setCardIndex(index + 1);
    return cardElement;
  });

  basket.total = cardsData.getTotal();
});

events.on('order:open', () => {
  modal.render({
    content: order.render({
      payment: '',
      address: '',
      valid: false,
      errors: []
    })
  })
})

events.on('order:change', (data: { field: keyof IDelivery; value: string }) => { 
  cardsData.setOrderField(data.field, data.value);
})


events.on('order:statusChange', (item: IOrderStatus) => { 
  console.log(item)
})
  

events.on('basket:clear', () => {
    cardsData.clearBasket();
    page.counter = 0;
});

events.on('contacts:open', () => {
  modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  })
})

events.on('success:open', () => {
  modal.render({
    content: success.render({
    })
  })
})



// events.on('formErrors:change', ())
// events.on('order:submit', () => {
//   if (cardsData.validateOrder()) {
//     events.emit();
//   } else {
//     events.emit('formErrors:change', cardsData.formErrors)
//   }
// })

// events.on('order:submit', () => {
// 	modal.render({
// 		content: contacts.render({
// 			phone: '',
// 			email: '',
// 			valid: false,
// 			errors: [],
// 		}),
// 	});
// });










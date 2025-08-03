import { EventEmitter, IEvents } from './components/base/events';
import { ICard, IShopsData, IOrder, IOrderResult, IShopApi, ICards, IDelivery, IOrderStatus } from './types/index';
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
import { Order } from './components/OrderView';


const events = new EventEmitter();
const baseApi: IShopApi = new Api(API_URL, CDN_URL);
const api = new ShopApi(baseApi);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const cardCatalogemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const cardsData = new ShopData(events);

const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events)
const contacts = new Order(cloneTemplate(contactsTemplate), events);
// получение сервера данных
api.getCardList()
.then((cards) => {    
    cardsData.setCards(cards.items)    
})
.catch((err) => {
		console.error(err);
	});

// получение карточек
events.on<ShopData>('items:updated', () => {
  page.gallery = cardsData.cards.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogemplate), events);
    return card.render({
      id: item.id,
      title: item.title,
      image: `${CDN_URL}${item.image}`,
      price: item.price,
      category: item.category,
    })
  });
})

events.on('card:select', (item: Card) => {
  cardsData.preview = item.id;
})

events.on('card:selected', (item: ICard) => {
  // page.locked = true;
  const card = new Card(cloneTemplate(cardPreviewTemplate) , events);
  
  modal.render({
    content: card.render({
      id: item.id,
      title: item.title,
      description: item.description,
      image: `${CDN_URL}${item.image}`,
      price: item.price,
      category: item.category,
    })
    
  });

})

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('basket:open', () => {
  modal.render({
    content: basket.render()
  });
})

events.on('card:add', (item: ICard) => {
  // Добавляем товар в корзину
  cardsData.addBasket(item);
    page.counter = cardsData.basketCount; 

  // Обновляем отображение корзины
  basket.items = cardsData.basket.map((basketItem, index) => {
      const card = new Card(cloneTemplate(cardBasketTemplate), events);
      const cardElement = card.render({
        id: basketItem.id,
        title: basketItem.title,
        price: basketItem.price
      });
      
      // Устанавливаем номер позиции (начинаем с 1)
      card.setCardIndex(index + 1);
      return cardElement;
  });

  // Обновляем общую сумму
  basket.total = cardsData.getTotal();
});

events.on('card:remove', (item: ICard) => {
  cardsData.removeBasket(item);
   page.counter = cardsData.basketCount;
})

events.on('basket:remove', (items: ICard[]) => {
  basket.items = items.map((basketItem, index) => {
      const card = new Card(cloneTemplate(cardBasketTemplate), events);
      const cardElement = card.render({
        id: basketItem.id,
        title: basketItem.title,
        price: basketItem.price
      });

      card.setCardIndex(index + 1);
      return cardElement;
  });

  basket.total = cardsData.getTotal();
})

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










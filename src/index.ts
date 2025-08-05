import { EventEmitter } from './components/base/events';
import { ICard, IOrder, IShopApi, IOrderData, IOrderStatus, IContact } from './types/index';
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
import { Order, Contact } from './components/OrderView';
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
const shopData = new ShopData(events);
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events)
const contacts = new Contact(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// Логирование всех событий
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

// Загрузка данных с сервера
api.getCardList()
  .then((cards) => {
    shopData.setCards(cards.items);
  })
  .catch((err) => {
    console.error(err);
  });

// Обработчики событий

// Управление модальными окнами - открытие
events.on('modal:open', () => {
  page.locked = true;
});

// Управление модальными окнами - закрытие
events.on('modal:close', () => {
  page.locked = false;
});

// Обновление каталога товаров
events.on<ShopData>('items:updated', () => {
  page.gallery = shopData.cards.map((item) => {
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
  shopData.preview = item.id;
});

// Отображение детальной информации о товаре
events.on('card:selected', (item: ICard) => {
  const cardPreview = new Card(cloneTemplate(cardPreviewTemplate), events);

  modal.render({
    content: cardPreview.render({
      id: item.id,
      title: item.title,
      description: item.description,
      image: `${CDN_URL}${item.image}`,
      price: item.price,
      category: item.category,
      inBasket: shopData.hasCardInBasket(item.id)
    })
  });
});

// открытие корзины
events.on('basket:open', () => {
  modal.render({
    content: basket.render()
  });
});

// Добавление товара в корзину
events.on('card:add', (item: Card) => {
  shopData.addBasket(item);
});

// Удаление товара из корзины
events.on('card:remove', (item: Card) => {
  shopData.removeBasket(item);
});

events.on('basket:change', (items: Card[]) => {
  page.counter = shopData.basketCount;
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

  basket.total = shopData.getTotal();
});

// Очистка корзины
events.on('basket:reset', () => {
  basket.items = [];
  basket.total = shopData.getTotal();
  page.counter = shopData.basketCount;
});

// Открытие формы оплата
events.on('order:open', () => {
  shopData.clearOrder();

  modal.render({
    content: order.render({
      payment: '',
      address: '',
      valid: false
    })
  });
});

// Обработка изменений в форме заказа
events.on('order:change', (data: { field: keyof IOrder; value: string }) => {
  shopData.setOrderField(data.field, data.value);
});

// Обработка изменения статуса заказа
events.on('order:statusChange', (item: IOrderStatus) => {
  order.valid = item.status;
  order.error = item.message;
});

// Обработка изменений в форме контактов
events.on('contacts:change', (data: { field: keyof IContact; value: string }) => {
  shopData.setOrderField(data.field, data.value);
});

// Открытие формы контактов
events.on('contacts:open', () => {
  modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
    })
  });
});

// Обработка изменения статуса контактов
events.on('contacts:statusChange', (item: IOrderStatus) => {
  contacts.valid = item.status;
  contacts.error = item.message;
});

// Оформление заказа
events.on('contacts:submit', () => {
  const orderData: IOrderData = {
    ...shopData.order,
    total: shopData.getTotal(),
    items: shopData.basket.map(item => item.id)
  };

  api.orderCards(orderData)
    .then((res) => {
      shopData.clearBasket()

      modal.render({
          content: success.render({
            total: res.total,
          })
      });
    })
    .catch((error) => {
      console.error(error);
    })
});

// Закрытие окна успешного оформления
events.on('success:close', () => {
  modal.close()
});
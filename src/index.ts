import { EventEmitter, IEvents } from './components/base/events';
import { ICard, IShopsData, IOrder, IOrderResult, IShopApi, ICards } from './types/index';
import { Api } from './components/base/api';
import { ShopData, Test } from '../src/components/CardsData';
import { Card } from '../src/components/CardView';
import { ShopApi } from '../src/components/ShopApi';
import { API_URL, settings } from './utils/constants';
import { cloneTemplate, ensureElement } from '../src/utils/utils';
import './scss/styles.scss';
import { Page } from './components/commom/Page';

const events = new EventEmitter();
const baseApi: IShopApi = new Api(API_URL, settings);
const api = new ShopApi(baseApi);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardsData = new ShopData(events);


// const cardView = new Card('card', cloneTemplate(cardTemplate), events);

const page = new Page(document.body, events);

// Promise.all([api.getCardList()])
// .then(([items]) => {
//     cardsData.cards = items;
//     console.log(cardsData.cards);
    
// })
// .catch((err) => {
// 		console.error(err);
// 	});

api.getCardList()
.then(cardsData.setCard.bind(cardsData))
.catch((err) => {
		console.error(err);
	});

// events.on<Test>('items:changed', () => {
//   const renderedCards = cardsData.cards.map((item: ICard) => {
//     const card = new Card('card', cloneTemplate(cardTemplate), events);
//     return card.render({
//       title: item.title,
//       image: item.image,
//       price: item.price,
//       category: item.category,
//     })
//   });
//      page.gallery = renderedCards;
// })

events.on<Test>('items:changed', () => {
  page.gallery = cardsData.cards.map((item) => {
    const card = new Card('card', cloneTemplate(cardTemplate), events);
    return card.render({
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
    })
  });
})







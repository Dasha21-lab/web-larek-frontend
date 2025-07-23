import { EventEmitter, IEvents } from './components/base/events';
import { ICard, ICardsData, IOrder, IOrderResult, IShopApi } from './types/index';
import { Api } from './components/base/api';
import { CardData } from '../src/components/CardsData';
import { ShopApi } from '../src/components/ShopApi';
import { API_URL, settings } from './utils/constants';
import './scss/styles.scss';

const events: IEvents = new EventEmitter();

const baseApi: IShopApi = new Api(API_URL, settings);
const api = new ShopApi(baseApi);

const cardsData = new CardData(events);

Promise.all([api.getCardList()])
.then(([items]) => {
    cardsData.cards = items;
    console.log(cardsData.cards)
})
  
.catch((err) => {
		console.error(err);
	});






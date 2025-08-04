import { IShopApi, ICard, ICards, IOrderData, IOrderResult } from '../types';

export class ShopApi {
    private _baseApi: IShopApi;

    constructor(baseApi: IShopApi) {
        this._baseApi = baseApi;
    }

    getCardList(): Promise<ICards> {
        return this._baseApi.get<ICards>(`/product`)
            .then((cards: ICards) => cards);
    }

    getCardItem(id: string): Promise<ICard> {
        return this._baseApi.get<ICard>(`/product/${id}`)
            .then((item: ICard) => item);
    }

    orderCards(order: IOrderData): Promise<IOrderResult> {
        return this._baseApi.post<IOrderResult>(`/order`, order)
            .then((res: IOrderResult) => res);
    }
}
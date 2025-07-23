import { IShopApi, ICard, IOrder, IOrderResult } from '../types';

export class ShopApi {
    private _baseApi: IShopApi;

    constructor(baseApi: IShopApi) {
        this._baseApi = baseApi;
    }

    getCardList(): Promise<ICard[]> {
        return this._baseApi.get<ICard[]>(`/product`)
            .then((items: ICard[]) => items);
    }

    getCardItem(id: string): Promise<ICard> {
        return this._baseApi.get<ICard>(`/product/${id}`)
            .then((item: ICard) => item);
    }

    orderCards(order: IOrder): Promise<IOrderResult> {
        return this._baseApi.post<IOrderResult>(`/order`, order)
            .then((res: IOrderResult) => res);
    }
}
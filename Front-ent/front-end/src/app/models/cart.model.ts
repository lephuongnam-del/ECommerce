import { productModel } from "./product.model";

export interface cartModelServer {
    total: number;
    data: [{
        product: productModel,
        numInCart: number
    }];
}

export interface cartModelPublic {
    total: number,
    prodData: [
        {
            id: number,
            incart: number
        }
    ];
}
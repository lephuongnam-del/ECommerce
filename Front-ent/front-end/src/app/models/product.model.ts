export interface productModel{
    id:number;
    name:string;
    category:string;
    description:string;
    price:number;
    image:string;
    quantity:number;
    images:string;
}


export interface serverResponse {
    count:number;
    products: productModel[];
}
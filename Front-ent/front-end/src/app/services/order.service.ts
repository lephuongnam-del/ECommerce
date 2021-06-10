import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  products:productResponseModel[] = [];
  private server_Url= environment.SERVER_URL;

  constructor(private http:HttpClient) { }

  getSingleOrder(orderId:number){
    return this.http.get<productResponseModel[]>(this.server_Url + '/orders/'+ orderId).toPromise();
  }

}

interface productResponseModel{
  id:number;
  title:string;
  description:string;
  price:number;
  quantityOrdered:number;
  image:string;
}
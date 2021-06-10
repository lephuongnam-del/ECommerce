import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { productModel } from 'src/app/models/product.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

  message: string;
  orderId: number;
  products;
  cartTotal: number

  constructor(private router: Router, private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      message:string,
      orderId:number,
      products:productModel[],
      total: number
    }

    this.message= state.message;
    this.orderId = state.orderId;
    this.products = state.products;
    this.cartTotal = state.total

  }

  ngOnInit(): void {
  }

}

interface productResposeModel {
  id: number,
  title: string,
  description: string,
  price: number,
  quantityOrdered: number,
  image: string
}
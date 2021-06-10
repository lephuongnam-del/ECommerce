import { Component, OnInit } from '@angular/core';
import { cartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartData: cartModelServer;
  cartTotal:number;
  subTotal:number;
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
  }

  changeQuantity(index:number, increase:boolean)
  {
    this.cartService.updateCartItems(index,increase);
  }

}

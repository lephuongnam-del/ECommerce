import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { productModel, serverResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: productModel[] = [];
  constructor(private productService: ProductService, private cartService:CartService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getAllproduct().subscribe((prods: serverResponse) => {
      this.products = prods.products;
    })
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  AddProduct(id:number){
   this.cartService.addProductToCart(id);

  }

}

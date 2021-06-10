import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { cartModelPublic, cartModelServer } from '../models/cart.model';
import { productModel } from '../models/product.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private server_URl = environment.SERVER_URL;

  // data in cart store on client local storage
  private cartDataClient: cartModelPublic = {
    total: 0,
    prodData: [{
      incart: 0,
      id: 0
    }]
  }

  // data to store information cart  on the server side

  private cartDataServer: cartModelServer = {
    total: 0,
    data: [{
      product: undefined,
      numInCart: 0

    }]
  }

  // observables for the component to subcribe
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<cartModelServer>(this.cartDataServer);
 

  constructor(private httpClient: HttpClient,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private toast:ToastrService, 
    private spinner : NgxSpinnerService) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    // get information from cart  local storage
    let info: cartModelPublic = JSON.parse(localStorage.getItem('cart'));

    // check information vaiable null or has something

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      this.cartDataClient = info;
      // data from client to server

      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: productModel) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProductInfo;

            // todo create calculateTotal funciton
            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          else {
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProductInfo
            });

            this.calculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }

          this.cartData$.next({ ...this.cartDataServer });
        })
      })
    }

  }

  CalculateSubTotal(index): Number {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    subTotal = p.product.price * p.numInCart;
    return subTotal;
  }


  addProductToCart(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe(prod => {
      // if the cart empty
      if (this.cartDataServer.data[0].product == undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;

        // caculate total amount
        this.calculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].id = prod.id;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({ ...this.cartDataServer });

        this.toast.success(`${prod.name} add to cart`,'product added',{
          timeOut:1500,
          progressBar:true,
          progressAnimation:'increasing',
          positionClass:'toast-top-right'
        } )
      }
      else {
        let index = this.cartDataServer.data.findIndex(p => p.product.id == prod.id);
        // if have item in cart
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          }
          else {
            this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          }

          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.toast.info(`${prod.name} quantity update to cart`,'product updated',{
            timeOut:1500,
            progressBar:true,
            progressAnimation:'increasing',
            positionClass:'toast-top-right'
          } )
        }
        // item not in cart 
        else {
          this.cartDataServer.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartDataClient.prodData.push({
            incart: 1,
            id: prod.id
          });

          this.toast.success(`${prod.name} add to cart`,'product added',{
            timeOut:1500,
            progressBar:true,
            progressAnimation:'increasing',
            positionClass:'toast-top-right'
          } )


          // calculate total
          this.calculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          this.cartData$.next({ ...this.cartDataServer });
        }
      }

    })

  }

  updateCartItems(index: number, increase: boolean) {
    let data = this.cartDataServer.data[index];

    if (increase) {
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      this.cartData$.next({...this.cartDataServer});
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    }
    else {
      data.numInCart--;
      if (data.numInCart < 1) {
        this.cartData$.next({ ...this.cartDataServer });
      }
      else {
        this.cartData$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;

        // calculate total
        this.calculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

      }
    }

  }

  deleteProductFromCart(index: number) {
    if (window.confirm('are you sure you want to remove item')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.calculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total == 0) {
        this.cartDataClient = { prodData: [{ incart: 0, id: 0 }], total: 0 };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
      else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total == 0) {
        this.cartDataServer = { data: [{ product: undefined, numInCart: 0 }], total: 0 }
        this.cartData$.next({ ...this.cartDataServer });
      }
      else {
        this.cartData$.next({ ...this.cartDataServer });
      }
    }
    else {
      return;
    }
  }

  CheckoutFromCart(userId: number) {

    this.httpClient.post(`${this.server_URl}/orders/payment`, null).subscribe((res: { success: Boolean }) => {
      console.clear();

      if (res.success) {


        this.resetServerdata();
        this.httpClient.post(`${this.server_URl}/orders/new`, {
          userId,
          products: this.cartDataClient.prodData
        }).subscribe((data: OrderConfirmationResponse) => {
            console.log(data)
          this.orderService.getSingleOrder(data.order_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {prodData: [{incart: 0, id: 0}], total: 0};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
          });

        })
      } else {
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry, failed to book the order`, "Order Status", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
    })
  }


  private calculateTotal() {
    let total = 0;
    this.cartDataServer.data.forEach(p => {
      const { numInCart } = p;
      const { price } = p.product;
      total += numInCart * price;
    })
    this.cartDataServer.total = total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  private resetServerdata() {
    this.cartDataServer = {
      data: [{
        product: undefined,
        numInCart: 0
      }],
      total: 0
    };
    this.cartData$.next({ ...this.cartDataServer });

  }
}

interface OrderConfirmationResponse {
  order_id: number;
  success: Boolean;
  message: String;
  products: [{
    id: String,
    numInCart: String
  }]
}

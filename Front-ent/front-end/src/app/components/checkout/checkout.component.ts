import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { cartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { render } from 'creditcardpayments/creditCardPayments';
import { debounceTime, map, takeLast } from 'rxjs/operators';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartData: cartModelServer;
  cartTotal: number;
  showSpinner: boolean;
  checkoutForm: FormGroup;



  constructor(private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder) {

    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],

    });



  }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.pipe(
      debounceTime(0)
    ).subscribe((total:number) => {
        this.cartTotal = total;
        render({
          id: '#mypaypal',
          currency: 'USD',
          value: total + '',
          onApprove: (detail) => {
            
            this.onCheckout()
            console.log("transaction successful")
          }
        })
      });
  }




  onCheckout() {
    this.spinner.show().then(p => {
      this.cartService.CheckoutFromCart(2);
    });
  }
}


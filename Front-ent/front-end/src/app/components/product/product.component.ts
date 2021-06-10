import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';


declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {
  id: number;
  product;
  thumbimages: any[] = [];

  @ViewChild('quantity') quantityInput;
  constructor(private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(map((param: ParamMap) => {
      // @ts-ignores
      return param.params.id
    })).subscribe(productId => {
      this.id = productId;
      this.productService.getSingleProduct(this.id).subscribe(product => {
        this.product = product;
        if (product.images !== null) {
          this.thumbimages = product.images.split(';');
        }
      })
    })

  }

  ngAfterViewInit() {
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  addToCart(id:number) {
    this.cartService.addProductToCart(id, this.quantityInput.nativeElement.value);
  }

  Increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity >= 1){
      value++;

      if (value > this.product.quantity) {
        // @ts-ignore
        value = this.product.quantity;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  Decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.product.quantity > 0){
      value--;

      if (value <= 0) {
        // @ts-ignore
        value = 0;
      }
    } else {
      return;
    }
    this.quantityInput.nativeElement.value = value.toString();
  
  }
}

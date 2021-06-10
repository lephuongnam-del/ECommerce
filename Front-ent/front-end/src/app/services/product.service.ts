import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { productModel, serverResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private SERVER_URL = environment.SERVER_URL;
  constructor(private http: HttpClient) { }

  getAllproduct(numberOfResults: number = 10): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.SERVER_URL + '/products', {
      params: {
        limit: numberOfResults.toString()
      }
    })
  }

  // get single product
  getSingleProduct(id: number): Observable<productModel> {
    return this.http.get<productModel>(this.SERVER_URL + '/products/' + id);
  }

  // get product from one category
  getProductFromCategory(catName: string): Observable<productModel[]> {
    return this.http.get<productModel[]>(this.SERVER_URL + '/products/category/' + catName);
  }



}

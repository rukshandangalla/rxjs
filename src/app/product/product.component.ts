import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getProducts().subscribe(
      data => {
        this.products = data;
      }
    );
  }
}

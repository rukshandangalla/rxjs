import { Component, OnInit } from '@angular/core';
import { map, tap, mergeMap, flatMap, switchMap, take, mergeAll, concatMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Product, ProductExt } from '../models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  basicMapedProducts: ProductExt[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadOriginal();
    this.performBasicMap();
    this.performMergeMap();
  }

  loadOriginal(): void {
    this.api.getProducts().subscribe(
      data => {
        this.products = data;
      }
    );
  }

  performBasicMap(): void {
    this.api.getProducts().pipe(
      map((products) => {
        const productsExt: ProductExt[] = [];
        products.forEach(p => {
          const pExt: ProductExt = {
            id: p.id,
            name: p.name,
            price: p.price * 2,
            location: p.location,
            nameWithPrice: `${p.name} - ${p.price}`
          };

          productsExt.push(pExt);
        });

        return productsExt;
      })
    ).subscribe(
      data => {
        this.basicMapedProducts = data;
      }
    );
  }

  performMergeMap(): void {
    this.api.getProducts().pipe(
      mergeMap(p => p),
      mergeMap(p => forkJoin(this.api.getProductById(p.id))),
      tap(p => { console.log(p); }),
    ).subscribe(
      data => {
        // console.log(data);
      }
    );
  }
}

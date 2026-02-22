import { Component, inject, resource, computed, effect, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';
import { ProduitService } from '../../services/produit/produit.service';
import { CategoryFilterService } from '../../services/category-filter/category-filter.service';

@Component({
  selector: 'app-home',
  imports: [
    ProductCardComponent,
    ProductCardSkeletonComponent,
    FooterComponent,
  ],
  template: `
    <div class="mt-28 pb-10 px-6">
      @if (isLoading) {
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-auto max-w-7xl gap-6"
      >
        @for (item of [1,2,3,4]; track item) {
        <app-product-card-skeleton />
        }
      </div>
      } @else {
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-auto max-w-7xl gap-6"
      >
        @for (product of products; track product._id) {
        <app-product-card [product]="product" />
        }
      </div>
      }
    </div>
    <app-footer />
  `,
})
export class HomeComponent implements OnInit {
  private readonly produitService = inject(ProduitService);
  private readonly categoryFilterService = inject(CategoryFilterService);

  products: any[] = [];
  isLoading = true;

  constructor() {

  }

  ngOnInit(): void {
    this.loadAllProducts();
    
    this.categoryFilterService.category$.subscribe(categoryId => {
      if (categoryId) {
        this.loadProductsByCategory(categoryId);
      } else {
        this.loadAllProducts();
      }
    });
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.produitService.getAllProducts()
      .subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
        }
      });
  }

  loadProductsByCategory(categorieId: string): void {
    this.isLoading = true;
    this.produitService.getProductsByCategory(categorieId)
      .subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products by category:', error);
          this.isLoading = false;
        }
      });
  }
}

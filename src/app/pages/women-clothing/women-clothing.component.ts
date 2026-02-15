import { Component, computed, inject, resource } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-women-clothing',
  imports: [
    ProductCardComponent,
    ProductCardSkeletonComponent,
    FooterComponent,
  ],
  template: `
    <div class="mt-28 pb-10 px-6">
      @if (isLoading()) {
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
        @for (product of productsResource.value(); track product._id) {
        <app-product-card [product]="product" />
        }
      </div>
      }
    </div>
    <app-footer />
  `,
})
export class WomenClothingComponent {
  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle("Women's Clothings");
    this.meta.updateTag({
      name: 'description',
      content:
        "Women's Clothings Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
    this.meta.updateTag({ property: 'og:title', content: "Women's Clothings" });
    this.meta.updateTag({
      property: 'og:description',
      content:
        "Women's Clothings Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
  }

  private readonly productCategory = "women's clothing";
  private readonly apiService = inject(ApiService);

  productsResource = resource({
    loader: () => this.apiService.getProducts(this.productCategory),
  });

  isLoading = computed(() => this.productsResource.isLoading());
}

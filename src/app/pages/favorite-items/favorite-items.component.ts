import { Component, computed, inject } from '@angular/core';
import { FavoriteItemsLocalStorageService } from '../../services/favorite-items-local-storage.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-favorite-items',
  imports: [ProductCardComponent, FooterComponent],
  template: `
    <div class="mt-28 pb-10 max-w-7xl px-6 mx-auto">
      <h2 class="text-xl font-bold uppercase">Your Favorite Items</h2>
      @if (favoriteItems().length > 0) {
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mx-auto max-w-7xl gap-6 mt-8"
      >
        @for (product of favoriteItems(); track product._id) {
        <app-product-card [product]="product" />
        }
      </div>

      } @else {
      <p class="text-lg text-center mt-10">No favorite item</p>
      }
    </div>
    <app-footer />
  `,
  styles: ``,
})
export class FavoriteItemsComponent {
  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Favorite Items');
    this.meta.updateTag({
      name: 'description',
      content:
        "Favorite Items Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
    this.meta.updateTag({ property: 'og:title', content: 'Favorite Items' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        "Favorite Items Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
  }

  private readonly favoriteItemsLocalStorageService = inject(
    FavoriteItemsLocalStorageService
  );

  favoriteItems = computed(() =>
    this.favoriteItemsLocalStorageService.favoriteItems()
  );
}

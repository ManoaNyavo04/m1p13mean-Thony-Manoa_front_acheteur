import { Component, computed, inject, input } from '@angular/core';
import { Product } from '../../../type';
import {
  faEye,
  faHeart,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { Router } from '@angular/router';
import { FavoriteItemsLocalStorageService } from '../../services/favorite-items-local-storage.service';

@Component({
  selector: 'app-product-card',
  imports: [FontAwesomeModule],
  template: `
    <div
      class="card hover:bg-base-200 transition-all bg-base-100 w-full h-full shadow-sm"
    >
      <figure>
        <img
          class="w-full h-[320px] object-fill"
          src=""
          alt="Shoes"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">
          {{ product()?.nomProduit }}
        </h2>
        <h3 class="text-lg text-green-500">{{ product()?.prix }} MGA</h3>

        <p class="line-clamp-3">
          Stock: {{ product()?.nombre }}
        </p>
        <div class="card-actions mt-4 w-full">
          <div class="flex items-center gap-x-2 w-full justify-between">
            <div class="flex items-center gap-x-2">
              <div class="tooltip" data-tip="View Detail">
                <button (click)="onClickNavigate()" class="btn btn-soft btn-sm">
                  <fa-icon [icon]="faEye"></fa-icon>
                </button>
              </div>
              <div class="tooltip" data-tip="Favorite">
                <button
                  (click)="toggleFavoriteItem()"
                  [class]="
                    checkFavoriteItemAlreadyExist()
                      ? 'btn btn-soft btn-primary btn-sm'
                      : 'btn btn-soft btn-sm'
                  "
                >
                  <fa-icon [icon]="faHeart"></fa-icon>
                </button>
              </div>
            </div>
            <div>
              <div class="badge badge-outline capitalize">
                {{ product()?.categorie?.categorie }}
              </div>
            </div>
          </div>
          <button
            [disabled]="checkItemAlreadyExist()"
            (click)="addItem()"
            class="mt-2 w-full btn btn-primary"
          >
            <fa-icon [icon]="faCartShopping"></fa-icon>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService
  );
  private readonly favoriteItemsLocalStorageService = inject(
    FavoriteItemsLocalStorageService
  );
  private readonly router = inject(Router);

  faHeart = faHeart;
  faEye = faEye;
  faCartShopping = faCartShopping;
  product = input<Product>();

  cartItems = computed(() => this.shoppingCartLocalStorageService.cartItems());

  addItem() {
    this.shoppingCartLocalStorageService.addItem({
      ...this?.product()!,
    });
  }

  checkItemAlreadyExist() {
    return this.shoppingCartLocalStorageService.checkItemAlreadyExist(
      this.product()?._id!
    );
  }

  checkFavoriteItemAlreadyExist() {
    return this.favoriteItemsLocalStorageService.checkItemAlreadyExist(
      this.product()?._id!
    );
  }

  toggleFavoriteItem() {
    if (this.checkFavoriteItemAlreadyExist()) {
      this.favoriteItemsLocalStorageService.removeItem(this.product()!);
    } else {
      this.favoriteItemsLocalStorageService.addItem(this.product()!);
    }
  }

  onClickNavigate() {
    this.router.navigate(['/products', this.product()?._id]);
  }
}

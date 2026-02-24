import { Component, inject, input } from '@angular/core';
import { Product } from '../../../type';
import { faMinus, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shopping-cart-item',
  imports: [FontAwesomeModule],
  template: `
    <div class="flex items-start justify-start gap-x-4">
      <figure>
        <img
          class="h-[130px] w-[140px] object-fill"
          [src]="getImageUrl(item()?.image)"
          [alt]="item()?.nomProduit || 'Product'"
        />
      </figure>
      <div class="w-full">
        <div class="space-y-1">
          <p class="font-bold">{{ item()?.nomProduit }}</p>
          <p class="font-bold text-lg mt-auto">{{ item()?.prix }} MGA</p>
        </div>
        <div class="mt-3 flex items-center justify-between gap-x-4">
          <div class="flex items-center gap-x-2">
            <button
              (click)="decrementItemQuantity()"
              class="btn btn-soft btn-sm"
            >
              <fa-icon [icon]="faMinus"></fa-icon>
            </button>
            <span>{{ item()?.quantity }}</span>
            <button
              (click)="incrementItemQuantity()"
              class="btn btn-soft btn-sm"
            >
              <fa-icon [icon]="faPlus"></fa-icon>
            </button>
          </div>
          <button
            (click)="removeItemQuantity()"
            class="btn btn-soft btn-error btn-sm"
          >
            <fa-icon [icon]="faTrashCan"></fa-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ShoppingCartItemComponent {
  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService
  );
  private readonly apiUrl = `${environment.apiUrl}`;

  faPlus = faPlus;
  faMinus = faMinus;
  faTrashCan = faTrashCan;

  item = input<Product>();

  incrementItemQuantity() {
    const newQuantity = this.item()?.quantity! + 1;
    if(newQuantity <= this.item()?.nombre!) {
      this.shoppingCartLocalStorageService.updateItem({
        ...this?.item()!,
        quantity: newQuantity
      });
    }
  }

  decrementItemQuantity() {
    // Remove item when quantity equal to 0
    if (this.item()?.quantity! <= 1) {
      this.shoppingCartLocalStorageService.removeItem(this.item()!);
    } else {
      this.shoppingCartLocalStorageService.updateItem({
        ...this?.item()!,
        quantity: this.item()?.quantity! - 1,
      });
    }
  }

  removeItemQuantity() {
    this.shoppingCartLocalStorageService.removeItem(this.item()!);
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return '/images/default-product.png';
    return `${this.apiUrl}/${imagePath}`;
  }
}

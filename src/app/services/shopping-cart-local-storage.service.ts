import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../type';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartLocalStorageService {
  private readonly key = 'ng_e_commerce_cart_items';

  cartItems = signal<Product[]>(this.loadItems());
  cartItemQuantity = computed(() => {
    return this.cartItems().reduce((a, c) => {
      a += c.quantity || 1; // Use existing quantity or default to 1
      return a;
    }, 0);
  });

  private loadItems(): Product[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  private saveItems(items: Product[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.cartItems.set(items); // Update the signal
  }

  addItem(item: Product) {
    item.quantity = 1;
    const items = [...this.cartItems()];
    items.push(item);
    this.saveItems(items);
  }

  removeItem(item: Product) {
    const newItems = this.cartItems().filter((i) => i._id !== item._id);
    this.saveItems(newItems);
  }

  updateItem(item: Product) {
    const newItems = this.cartItems().map((i) => {
      if (i._id !== item._id) {
        return i;
      } else {
        return item;
      }
    });
    this.saveItems(newItems);
  }

  clearItems() {
    localStorage.removeItem(this.key);
    this.cartItems.set([]);
  }

  checkItemAlreadyExist(id: string) {
    return this.cartItems().some((ct) => ct._id === id);
  }
}

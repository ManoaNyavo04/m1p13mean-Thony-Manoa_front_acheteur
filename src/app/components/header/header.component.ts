import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faHamburger,
  faHeart,
  faShoppingBag,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { CategorieService } from '../../services/categorie/categorie.service';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive],
  template: `
    <header
      class="w-full py-4 top-0 fixed bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-90 z-50 border-b border-b-base-300"
    >
      <div class="max-w-7xl px-6 mx-auto flex items-center justify-between">
        <div class="flex items-center gap-x-5">
          <a
            class="flex items-center gap-x-3 text-xl btn btn-ghost group"
            routerLink="/"
          >
            <fa-icon
              class="group-hover:text-primary"
              [icon]="faShoppingBag"
            ></fa-icon>
            <span class="hidden lg:block">NG-Commerce</span>
          </a>
          <div class="items-center gap-x-5 hidden lg:flex">
            <a
              routerLink="/"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: true }"
              class="hover:underline transition-all"
              >All</a
            >
            @for (category of categories; track category._id) {
            <a
              [routerLink]="'/' + category.categorie.toLowerCase()"
              routerLinkActive="active-link"
              [routerLinkActiveOptions]="{ exact: true }"
              class="hover:underline transition-all"
              >{{ category.categorie }}</a
            >
            }
          </div>
        </div>
        <div class="hidden lg:flex items-center gap-x-2">
          <a
            routerLink="/favorite-items"
            class="btn btn-ghost"
            routerLinkActive="bg-primary text-white"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <fa-icon [icon]="faHeart"></fa-icon>
          </a>
          <a
            routerLink="/shopping-cart"
            class="btn btn-ghost relative"
            routerLinkActive="bg-primary text-white"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <fa-icon [icon]="faCartShopping"></fa-icon>
            @if (cartItemQuantity() >= 1) {
            <div class="absolute -top-2 -right-2 badge badge-primary badge-sm">
              {{ cartItemQuantity() }}
            </div>
            }
          </a>
          <a
            routerLink="/login"
            class="btn btn-ghost"
            routerLinkActive="bg-primary text-white"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <fa-icon [icon]="faUser"></fa-icon>
          </a>
          <select data-choose-theme>
            <option value="dark">Default</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div class="block lg:hidden dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn m-1">
            <fa-icon [icon]="faHamburger"></fa-icon>
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
          </ul>
        </div>
      </div>
    </header>
  `,
  styles: `
    .active-link {
    color: "#d1d5dc";
    text-decoration: underline;
  }
  `,
})
export class HeaderComponent implements OnInit {
  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService
  );
  private readonly categorieService = inject(CategorieService);

  faCartShopping = faCartShopping;
  faShoppingBag = faShoppingBag;
  faHamburger = faHamburger;
  faHeart = faHeart;
  faUser = faUser;

  categories: any[] = [];

  cartItemQuantity = computed(() =>
    this.shoppingCartLocalStorageService.cartItemQuantity()
  );

  ngOnInit(): void {
    this.categorieService.getAllCategories()
      .subscribe({
        next: (categories) => this.categories = categories,
        error: (error) => console.error('Error loading categories:', error)
      });
  }
}

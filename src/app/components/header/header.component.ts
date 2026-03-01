import { Component, computed, inject, OnInit, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faHamburger,
  faHeart,
  faShoppingBag,
  faUser,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { CategorieService } from '../../services/categorie/categorie.service';
import { UtilisateursService } from '../../services/utilisateurs/utilisateurs';
import { CategoryFilterService } from '../../services/category-filter/category-filter.service';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit/produit.service';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule, RouterLink, RouterLinkActive, FormsModule],
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
            <span class="hidden lg:block">Centre Commercial</span>
          </a>
          <div class="items-center gap-x-3 hidden lg:flex">
            <div class="dropdown">
              <div tabindex="0" role="button" class="btn btn-primary btn-sm">
                {{ selectedCategoryId ? getSelectedCategoryName() : 'All Categories' }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow-lg border border-base-300 mt-2">
                <li>
                  <a (click)="onCategoryClick(null)" [class]="selectedCategoryId === null ? 'bg-primary text-white' : ''">All Categories</a>
                </li>
                <li class="divider"></li>
                @for (category of categories; track category._id) {
                <li>
                  <a (click)="onCategoryClick(category._id)" [class]="selectedCategoryId === category._id ? 'bg-primary text-white' : ''">{{ category.categorie }}</a>
                </li>
                }
              </ul>
            </div>
            <div class="join">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (keyup.enter)="onSearch()" 
                placeholder="Search products..." 
                class="input input-bordered input-sm join-item w-64" 
              />
              <button class="btn btn-sm btn-primary join-item" (click)="onSearch()">
                <fa-icon [icon]="faSearch"></fa-icon>
              </button>
            </div>
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
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost">
              <fa-icon [icon]="faUser"></fa-icon>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              @if (userData) {
              <li class="menu-title">
                <span>{{ userData.nom }}</span>
                <span class="text-xs">{{ userData.mail }}</span>
              </li>
              <li><a routerLink="/profile">Profile</a></li>
              <li><a routerLink="/orders">My Orders</a></li>
              <li><a (click)="logout()">Logout</a></li>
              } @else {
              <li><a routerLink="/login">Login</a></li>
              <li><a routerLink="/register">Register</a></li>
              }
            </ul>
          </div>
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
  private readonly utilisateursService = inject(UtilisateursService);
  private readonly categoryFilterService = inject(CategoryFilterService);
  private readonly router = inject(Router);

  faCartShopping = faCartShopping;
  faShoppingBag = faShoppingBag;
  faHamburger = faHamburger;
  faHeart = faHeart;
  faUser = faUser;
  faSearch = faSearch;

  categories: any[] = [];
  userData = this.utilisateursService.getUserData();
  selectedCategoryId: string | null = null;
  searchQuery: string = '';

  cartItemQuantity = computed(() =>
    this.shoppingCartLocalStorageService.cartItemQuantity()
  );

  ngOnInit(): void {
    this.categorieService.getAllCategories()
      .subscribe({
        next: (categories) => this.categories = categories,
        error: (error) => console.error('Error loading categories:', error)
      });
    
    this.categoryFilterService.category$.subscribe(categoryId => {
      this.selectedCategoryId = categoryId;
    });

    this.categoryFilterService.userData$.subscribe(userData => {
      this.userData = userData || this.utilisateursService.getUserData();
    });
  }

  logout() {
    this.utilisateursService.removeToken();
    this.utilisateursService.removeUserData();
    this.userData = null;
    this.router.navigate(['/login']);
  }

  onCategoryClick(categoryId: string | null): void {
    this.searchQuery = '';
    this.categoryFilterService.setCategory(categoryId);
  }

  getSelectedCategoryName(): string {
    const category = this.categories.find(c => c._id === this.selectedCategoryId);
    return category ? category.categorie : 'All Categories';
  }

  onSearch(): void {
    console.log('Search query:', this.searchQuery);
    this.categoryFilterService.setSearchQuery(this.searchQuery.trim());
    this.router.navigate(['/']);
  }
}

import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCartShopping,
  faChevronLeft,
  faChevronRight,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../../components/product-card-skeleton/product-card-skeleton.component';
import { Meta, Title } from '@angular/platform-browser';
import { FavoriteItemsLocalStorageService } from '../../services/favorite-items-local-storage.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-product-detail',
  imports: [
    FontAwesomeModule,
    ProductCardComponent,
    ProductCardSkeletonComponent,
    FooterComponent,
  ],
  template: `
    <div class="min-h-full">
      <div class="mx-auto pt-24 pb-10 px-6 max-w-7xl">
        <div
          class="border-y border-y-base-300 flex gap-x-2 justify-end py-2 mb-8"
        >
          <button
            (click)="toggleFavoriteItem()"
            [class]="
              checkFavoriteItemAlreadyExist()
                ? 'btn btn-soft btn-primary btn-md'
                : 'btn btn-soft btn-md'
            "
          >
            <fa-icon [icon]="faHeart"></fa-icon>
          </button>
          <div class="flex items-center gap-x-2">
            <button
              [disabled]="isFirstItem()"
              (click)="handlePrevNavigation()"
              class="btn btn-ghost btn-md"
            >
              <fa-icon [icon]="faChevronLeft"></fa-icon>
            </button>
            <button
              [disabled]="isLastItem()"
              (click)="handleNextNavigation()"
              class="btn btn-ghost btn-md"
            >
              <fa-icon [icon]="faChevronRight"></fa-icon>
            </button>
          </div>
        </div>
        <div
          class="flex flex-col-reverse lg:flex-row gap-y-10 justify-between gap-x-10"
        >
          <div class="w-full md:w-[70%]">
            @if (this.productResource.isLoading()) {
            <figure>
              <div class="w-full h-[350px] md:h-[550px] skeleton"></div>
            </figure>
            } @else {
            <figure>
              <img
                class="w-full h-[350px] md:h-[550px]"
                src=""
                [alt]="this.productResource.value()?.nomProduit"
              />
            </figure>
            }
          </div>
          <div class="w-full">
            @if (this.productResource.isLoading()) {
            <div class="skeleton w-full h-[40px]"></div>
            <div class="skeleton w-[100px] mt-3 h-[20px]"></div>
            <div class="skeleton w-full mt-4 h-[150px]"></div>
            <div class="skeleton w-full mt-8 h-[50px]"></div>
            } @else {
            <h2 class="text-2xl font-bold mb-3">
              {{ this.productResource.value()?.nomProduit }}
            </h2>
            <h3 class="text-3xl font-bold">
              $ {{ this.productResource.value()?.prix }}
            </h3>
            <p class="leading-6 mt-4">
              Stock: {{ this.productResource.value()?.nombre }}
            </p>
            <div class="badge badge-outline capitalize mt-2">
              {{ this.productResource.value()?.categorie?.categorie }}
            </div>
            <button
              [disabled]="checkItemAlreadyExist()"
              (click)="addItem()"
              class="w-full btn btn-primary mt-8"
            >
              <fa-icon [icon]="faCartShopping"></fa-icon>
              Add to Cart
            </button>
            }
          </div>
        </div>
      </div>
      <div class="mx-auto pt-28 pb-10 px-6 max-w-7xl">
        <div class="mt-10">
          <h3 class="text-2xl font-bold mb-8">Other similar products</h3>
          @if (isLoadingSimilarProductResource()) {
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
            @for (similarProduct of similarProductResource.value(); track
            similarProduct._id) {
            <app-product-card [product]="similarProduct" />
            }
          </div>
          }
        </div>
      </div>
    </div>
    <app-footer />
  `,
  styles: ``,
})
export class ProductDetailComponent implements OnInit {
  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Product Details');
    this.meta.updateTag({
      name: 'description',
      content:
        "Product Details Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
    this.meta.updateTag({ property: 'og:title', content: 'Product Details' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        "Product Details Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
  }

  faCartShopping = faCartShopping;
  faChevronRight = faChevronRight;
  faHeart = faHeart;
  faChevronLeft = faChevronLeft;

  private readonly apiService = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService
  );
  private readonly favoriteItemsLocalStorageService = inject(
    FavoriteItemsLocalStorageService
  );

  productId = signal<string>('');

  productResource = resource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => this.apiService.getProductById(request.id),
  });
  similarProductResource = resource({
    request: () => ({ category: this.productResource.value()?.categorie?.categorie }),
    loader: ({ request }) =>
      this.apiService.getProductsWithLimit(4, request.category),
  });

  isFirstItem = computed(() => Number(this.productId()) === 1);
  isLastItem = computed(() => Number(this.productId()) === 20);
  isLoading = computed(() => this.productResource.isLoading());
  isLoadingSimilarProductResource = computed(() =>
    this.similarProductResource.isLoading()
  );

  errorEffect = effect(() => {
    const error = this.productResource.error() as Error;
    if (error) {
      console.log(error);
    }
  });

  ngOnInit() {
    this.route.paramMap.subscribe((param) =>
      this.productId.set(param.get('id')!)
    );
  }

  handlePrevNavigation() {
    if (+this.productId() <= 1) {
      return;
    }
    const newId = (Number(this.productId()) - 1).toString();
    this.productId.set(newId);
    this.router.navigate(['/products', newId]);
  }

  handleNextNavigation() {
    if (+this.productId() >= 20) {
      return;
    }

    const newId = (Number(this.productId()) + 1).toString();
    this.productId.set(newId);
    this.router.navigate(['/products', newId]);
  }

  checkItemAlreadyExist() {
    return this.shoppingCartLocalStorageService.checkItemAlreadyExist(
      this.productResource.value()?._id!
    );
  }

  addItem() {
    this.shoppingCartLocalStorageService.addItem({
      ...this?.productResource.value()!,
    });
  }

  checkFavoriteItemAlreadyExist() {
    return this.favoriteItemsLocalStorageService.checkItemAlreadyExist(
      this.productResource.value()?._id!
    );
  }

  toggleFavoriteItem() {
    if (this.checkFavoriteItemAlreadyExist()) {
      this.favoriteItemsLocalStorageService.removeItem(
        this.productResource.value()!
      );
    } else {
      this.favoriteItemsLocalStorageService.addItem(
        this.productResource.value()!
      );
    }
  }
}

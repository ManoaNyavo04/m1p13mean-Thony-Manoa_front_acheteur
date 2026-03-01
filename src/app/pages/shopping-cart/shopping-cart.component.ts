import {
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ShoppingCartLocalStorageService } from '../../services/shopping-cart-local-storage.service';
import {
  faCheckCircle,
  faExclamationCircle,
  faMinus,
  faPlus,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';
import { PaymentInfoLocalStorageService } from '../../services/payment-info-local-storage.service';
import { PaymentInfoData } from '../../../type';
import { ShoppingCartItemComponent } from '../../components/shopping-cart-item/shopping-cart-item.component';
import { Meta, Title } from '@angular/platform-browser';
import { CommandeService } from '../../services/commande/commande.service';
import { UtilisateursService } from '../../services/utilisateurs/utilisateurs';

@Component({
  selector: 'app-shopping-cart',
  imports: [FontAwesomeModule, ShoppingCartItemComponent, RouterLink],
  template: `
    @if (!isUserConnected()) {
    <div class="flex items-center justify-center min-h-screen px-6">
      <div class="text-center">
        <fa-icon [icon]="faExclamationCircle" class="text-6xl text-warning mb-4"></fa-icon>
        <h2 class="text-2xl font-bold mb-2">Veuillez vous connecter</h2>
        <p class="text-gray-400 mb-4">Vous devez être connecté pour accéder à votre panier</p>
        <a routerLink="/login" class="btn btn-primary">Se connecter</a>
      </div>
    </div>
    } @else {
    <div class="mx-auto flex flex-col-reverse lg:flex-row gap-x-20 min-h-full">
      <div class="w-full py-14 lg:py-0 lg:pb-0 lg:pt-28 px-6 lg:pl-24 lg:pr-8">
        <form (submit)="simulateCheckoutProcessing($event)">
          <!-- Shipping Address -->
          <fieldset class="mt-4 fieldset px-0 p-4">
            <legend class="fieldset-legend text-lg uppercase">
              Adresse de livraison
            </legend>
            <textarea
              type="text"
              required
              class="input validator w-full min-h-[80px]"
              placeholder="Votre adresse..."
              (change)="handleInputChange($event, 'address')"
              >{{ paymentInfoData()?.address || '' }}</textarea
            >
          </fieldset>
          @if(cartItemQuantity() >= 1) {
          <div class="border-t border-t-base-300 pt-4 mt-4 space-y-2">
            <div class="flex items-center justify-between">
              <span>Quantité totale</span>
              <span class="text-lg font-bold">{{ cartItemQuantity()}}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Montant total</span>
              <span class="text-lg font-bold">{{ totalPrice() + ' MGA'}}</span>
            </div>
          </div>
          <button class="btn btn-primary w-full mt-2" type="submit">
            @if (!isLoading() && !isSuccess()) { Payer
            {{ totalPrice() + ' MGA'}}
            } @else if (!isLoading() && isSuccess()) { Paiement réussi } @else
            { Traitement de votre paiement... }
          </button>
          }
        </form>
      </div>
      <div
        class="w-full pb-14 lg:pb-0 lg:py-0 pt-28 lg:pt-28 px-6 lg:pr-24 lg:pl-8"
      >
        <h2 class="text-xl font-bold uppercase">Résumé de la commande</h2>
        <p>
          Vérifiez vos articles et sélectionnez votre mode de livraison pour une meilleure expérience
        </p>
        <div>
          @if(cartItemQuantity() >= 1) {
          <div
            class="mt-4 border border-gray-900 rounded-lg px-4 py-6 space-y-6 max-h-[calc(100dvh-200px)] overflow-y-auto"
          >
            @for(item of cartItems(); track item._id) {
            <div
              class="border-b border-b-gray-900 pb-5 last:pb-0 last:border-b-0"
            >
              <app-shopping-cart-item [item]="item" />
            </div>
            }
          </div>
          } @else {
          <div class="mt-10 flex items-center justify-center flex-col gap-y-2">
            <p class="text-xl text-center text-gray-400">
              Aucun article dans votre panier
            </p>
            <a routerLink="/" class="btn btn-soft">Continuer vos achats</a>
          </div>
          }
        </div>
      </div>
    </div>
    }
    <dialog #checkoutSuccessDialog class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <div class="flex items-center justify-center w-full mb-4">
          <fa-icon
            [icon]="faCheckCircle"
            class="text-6xl text-emerald-500"
          ></fa-icon>
        </div>
        <h3 class="text-xl font-bold text-center">
          Merci pour votre achat
        </h3>
        <div class="modal-action">
          <form method="dialog">
            <button (click)="closeDialog()" class="btn btn-sm">Fermer</button>
          </form>
        </div>
      </div>
    </dialog>
  `,
})
export class ShoppingCartComponent {
  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Shopping Cart');
    this.meta.updateTag({
      name: 'description',
      content:
        "Shopping Cart Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
    this.meta.updateTag({ property: 'og:title', content: 'Shopping Cart' });
    this.meta.updateTag({
      property: 'og:description',
      content:
        "Shopping Cart Page - This is a modern, responsive e-commerce template built Angular and TailwindCSS. It's designed to be a starting point for building full-featured e-commerce applications. The template includes a clean and customizable design, ideal for minimalist online stores.",
    });
  }

  faPlus = faPlus;
  faMinus = faMinus;
  faTrashCan = faTrashCan;
  faCheckCircle = faCheckCircle;
  faExclamationCircle = faExclamationCircle;

  private readonly shoppingCartLocalStorageService = inject(
    ShoppingCartLocalStorageService
  );
  private readonly paymentInfoLocalStorageService = inject(
    PaymentInfoLocalStorageService
  );
  private readonly commandeService = inject(CommandeService);
  private readonly utilisateursService = inject(UtilisateursService);

  private readonly router = inject(Router);

  isUserConnected = computed(() => {
    const token = this.utilisateursService.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.type === 1;
    } catch {
      return false;
    }
  });

  rememberPaymentInfo = signal(true);
  isLoading = signal(false);
  isSuccess = signal(false);

  private checkoutSuccessDialog = viewChild<ElementRef<HTMLDialogElement>>(
    'checkoutSuccessDialog'
  );


  cartItems = computed(() => this.shoppingCartLocalStorageService.cartItems());

  cartItemQuantity = computed(() =>
    this.shoppingCartLocalStorageService.cartItemQuantity()
  );
  paymentInfoData = signal(
    this.paymentInfoLocalStorageService.paymentInfoData()
  );

  totalPrice = computed(() => {
    return new Intl.NumberFormat('en-IN').format(
      this.cartItems().reduce((a, c) => {
        a += c?.prix * c?.quantity!;
        return a;
      }, 0)
    );
  });

  simulateCheckoutProcessing(event: Event) {
    event.preventDefault();

    this.isLoading.set(true);

    const orderData = {
      produits: this.cartItems().map(item => ({
        produit: item._id,
        boutique: item.boutique,
        prix: item.prix,
        nombre: item.quantity || 1,
        prixTotal: item.prix * (item.quantity || 1)
      })),
      lieu: this.paymentInfoData()?.address || ''
    };

    this.commandeService.createOrder(orderData)
      .subscribe({
        next: (response) => {
          console.log('Order created:', response);
          this.isLoading.set(false);
          this.isSuccess.set(true);
          this.checkoutSuccessDialog()?.nativeElement.showModal();
        },
        error: (error) => {
          console.error('Order failed:', error);
          this.isLoading.set(false);
        }
      });
  }

  closeDialog() {
    this.checkoutSuccessDialog()?.nativeElement.close();
    this.isLoading.set(false);
    this.isSuccess.set(false);

    // Save payment info data
    if (this.rememberPaymentInfo() && this.paymentInfoData()) {
      this.paymentInfoLocalStorageService.saveData(this.paymentInfoData()!);
    } else {
      this.paymentInfoLocalStorageService.clearItem();
    }

    // Clear localStorage for shopping cart items
    this.shoppingCartLocalStorageService.clearItems();
    // Currently clear out the payment info form when form close
    this.paymentInfoData.set(null);
    this.router.navigate(['/']);
  }

  toggleRememberPaymentInfo(event: Event) {
    const target = event.target as HTMLInputElement;
    this.rememberPaymentInfo.set(target.checked);
  }

  handleInputChange(event: Event, field: keyof PaymentInfoData) {
    const target = event.target as HTMLInputElement;
    // Update the corresponding field in the signal
    this.paymentInfoData.set({
      ...this.paymentInfoData()!,
      [field]: target.value,
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OrderProduct {
  produit: string;
  boutique: string;
  prix: number;
  nombre: number;
  prixTotal: number;
}

export interface CreateOrderRequest {
  produits: OrderProduct[];
  lieu: string;
}

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/commande`;

  createOrder(orderData: CreateOrderRequest): Observable<any> {
    return this.http.post(this.apiUrl, orderData);
  }
}

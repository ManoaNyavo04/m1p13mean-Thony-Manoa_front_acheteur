import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/produit`;

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available`);
  }

  getProductsByCategory(categorieId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorie/${categorieId}`);
  }

  searchProducts(query: string, categorieId?: string): Observable<any> {
    let url = `${this.apiUrl}/search?q=${query}`;
    if (categorieId) {
      url += `&categorie=${categorieId}`;
    }
    return this.http.get(url);
  }
}

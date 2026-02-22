import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  mail: string;
  mdp: string;
}

export interface RegisterRequest {
  nom: string;
  mail: string;
  contact: string;
  mdp: string;
}

export interface UserData {
  nom: string;
  mail: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilisateursService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/acheteur`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_DATA_KEY = 'user_data';

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  saveUserData(userData: UserData): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
  }

  getUserData(): UserData | null {
    const data = localStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  removeUserData(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
  }
}

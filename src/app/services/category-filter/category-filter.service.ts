import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../utilisateurs/utilisateurs';

@Injectable({
  providedIn: 'root',
})
export class CategoryFilterService {
  private categorySubject = new BehaviorSubject<string | null>(null);
  category$ = this.categorySubject.asObservable();

  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  userData$ = this.userDataSubject.asObservable();

  setCategory(categoryId: string | null): void {
    this.categorySubject.next(categoryId);
  }

  setUserData(userData: UserData | null): void {
    this.userDataSubject.next(userData);
  }
}

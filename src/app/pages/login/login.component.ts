import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { UtilisateursService } from '../../services/utilisateurs/utilisateurs';
import { Router, RouterLink } from '@angular/router';
import { CategoryFilterService } from '../../services/category-filter/category-filter.service';

@Component({
  selector: 'app-login',
  imports: [FontAwesomeModule, FooterComponent, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly utilisateursService = inject(UtilisateursService);
  private readonly categoryFilterService = inject(CategoryFilterService);
  private readonly router = inject(Router);

  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Login');
    this.meta.updateTag({
      name: 'description',
      content: 'Login to your account',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Login' });
  }

  faUser = faUser;
  faLock = faLock;

  email = '';
  password = '';
  errorMessage = '';

  onLogin() {
    this.errorMessage = '';
    this.utilisateursService.login({ mail: this.email, mdp: this.password })
      .subscribe({
        next: (response) => {
          this.utilisateursService.saveToken(response.token);
          const userData = {
            nom: response.user.nom,
            mail: response.user.mail
          };
          this.utilisateursService.saveUserData(userData);
          this.categoryFilterService.setUserData(userData);
          this.router.navigate(['']);
        },
        error: (error) => this.errorMessage = error.error?.message || 'Login failed. Please try again.'
      });
  }
}

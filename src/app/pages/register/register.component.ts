import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faLock, faEnvelope, faPhone, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Meta, Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { UtilisateursService } from '../../services/utilisateurs/utilisateurs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FontAwesomeModule, FooterComponent, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly utilisateursService = inject(UtilisateursService);
  private readonly router = inject(Router);

  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Register');
    this.meta.updateTag({
      name: 'description',
      content: 'Create your account',
    });
    this.meta.updateTag({ property: 'og:title', content: 'Register' });
  }

  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  nom = '';
  email = '';
  contact = '';
  password = '';
  errorMessage = '';
  showPassword = false;

  onRegister() {
    this.errorMessage = '';
    this.utilisateursService.register({ nom: this.nom, mail: this.email, contact: this.contact, mdp: this.password })
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('Registration error:', error);
          this.errorMessage = error.error.error || 'Échec de l\'inscription. Veuillez réessayer.';
        }
      });
  }
}

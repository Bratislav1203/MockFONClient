import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SweetalertService } from '../../../services/sweetalert.service'; // Importuj SweetAlert servis

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sweetalertService: SweetalertService // Dodaj SweetAlert servis
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    // Provera da li su polja popunjena
    if (!this.email || !this.password) {
      this.sweetalertService.showError('Potrebni su i email i lozinka!', 'Greška');
      return;
    }

    // Poziv metode za prijavu
    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        this.router.navigate(['/exams']);
        this.sweetalertService.showSuccess('Uspešna prijava!', 'Dobrodošli');
      },
      error: (error) => {
        console.log(error);
        const errorMessage = error.error || 'Neuspešna prijava! Proverite vaše kredencijale i pokušajte ponovo.';
        console.log(errorMessage);
        this.sweetalertService.showError(errorMessage, 'Greška');
      }
    });
  }
}

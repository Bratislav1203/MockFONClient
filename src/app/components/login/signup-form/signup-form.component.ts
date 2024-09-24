import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { SweetalertService } from '../../../services/sweetalert.service'; // Importuj SweetAlert servis

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  firstName = '';
  lastName = '';
  email = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sweetalertService: SweetalertService // Dodaj SweetAlert servis
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.firstName || !this.lastName || !this.email) {
      this.sweetalertService.showError('Morate popuniti sva polja!', 'Greška');
      return;
    }

    this.authService.signup(this.firstName, this.lastName, this.email).subscribe({
      next: (message) => {
        console.log(message);
        this.sweetalertService.showSuccess('Uspešna registracija! Molimo vas proverite vaš email i izvršite validaciju naloga klikom na link koji smo poslali.', 'Registracija uspešna');
      },
      error: (error) => {
        console.error('Registration error:', error);
        if (error.status === 409) {
          this.sweetalertService.showError(error.error, 'Greška');
        } else {
          this.sweetalertService.showError('Neuspešna registracija!', 'Greška');
        }
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  address: string = '';
  umcn: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.address || !this.umcn) {
      alert('Moras da popunis sva polja!');
      return;
    }
    if (!this.isValidJMBG(this.umcn)) {
      alert('JMBG nije validan. Mora biti broj od 13 cifara.');
      return;
    }

    this.authService.signup(this.firstName, this.lastName, this.email, this.password, this.address, this.umcn).subscribe({
      next: (message) => {  // Ovde se očekuje da je 'message' tipa string
        console.log(message); // Možete i ovde logovati poruku ako želite
        alert('Uspesna registracija. Molimo vas proverite vaš email i izvršite validaciju naloga klikom na link koji smo poslali kako biste potvrdili svoj nalog.');
      },
      error: (error) => {
        console.error('Registration error:', error);
        alert('Neuspesna registracija!');
      }
    });
  }



  private isValidJMBG(umcn: string): boolean {
    const umcnPattern = /^\d{13}$/;
    return umcnPattern.test(umcn);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  email = '';
  password = '';


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      alert('Both email and password are required!');
      return;
    }
    this.authService.login(this.email, this.password).subscribe(
      success => {
        this.router.navigate(['/exams']);
        alert('Uspesna prijava!');
      },
      error => {
        const errorMessage = error.error || 'Neuspesna prijava! Provjerite vaše kredencijale i pokušajte ponovo.';
        console.log(errorMessage);
        alert(errorMessage);
      });
  }


}

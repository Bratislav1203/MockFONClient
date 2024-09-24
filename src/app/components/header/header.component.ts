import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean;
  isAdmin: boolean;
  constructor(private authService: AuthService) {
  }


  ngOnInit(): void {
    this.authService.loggedInStatus$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.isUserAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  logout(): void{
    this.authService.logout();
  }

}

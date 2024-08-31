import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mockfon';
  isLoginUrl: boolean;
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    let route;
    this.router.events.subscribe((val) => {
        route = location.pathname;
        this.isLoginUrl = route.endsWith("/login");
        // if (this.isLoginUrl) {
        //   if (this.authService.isLoggedIn()) {
        //     this.router.navigate(['/exams']);
        //   }
        // } else {
        //   if (!this.authService.isLoggedIn()) {
        //     this.router.navigate(['/login']);
        //   }
        // }
    });
  }
}

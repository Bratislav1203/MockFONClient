import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';

  private loggedInStatus = new BehaviorSubject<boolean>(false);
  loggedInStatus$ = this.loggedInStatus.asObservable();

  private isAdmin = new BehaviorSubject<boolean>(false);
  isUserAdmin$ = this.isAdmin.asObservable();

  constructor(private http: HttpClient) {
    this.autoLogin();
  }

  // tslint:disable-next-line:typedef
  get isLoggedIn() {
    return this.loggedInStatus.asObservable();
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response) {
            this.storeSessionData(response);
            this.loggedInStatus.next(true);
            this.isAdmin.next(response.admin);
          }
        })
      );
  }

  logout(): void {
    console.log('Logged out');
    localStorage.clear();
    this.loggedInStatus.next(false);
    this.isAdmin.next(false);
  }

  signup(name: string, surname: string, email: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/signup`, { name, surname, email }, { responseType: 'text' });
  }



  private storeSessionData(response: any): void {
    localStorage.setItem('authToken', response.authenticationToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    const expiresAt = response.expiresAt * 1000; // Conversion to milliseconds
    localStorage.setItem('expiresAt', JSON.stringify(expiresAt));
    localStorage.setItem('name', response.name);
    localStorage.setItem('surname', response.surname);
    localStorage.setItem('umcn', response.umcn);
    localStorage.setItem('email', response.email);
    localStorage.setItem('isAdmin', String(response.admin));
  }

  private autoLogin(): void {
    const expiresAt = localStorage.getItem('expiresAt');
    if (expiresAt && new Date().getTime() < JSON.parse(expiresAt)) {
      this.loggedInStatus.next(true);
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.isAdmin.next(isAdmin);
      console.log('Auto-login successful');
    } else {
      this.logout();
      console.log('Auto-login failed: token expired or not present');
    }
  }

  public isUserAdmin(): boolean {
    if (this.isAdmin) {
      return true;
    }
    return false;
  }
// authService.ts
  getToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  getEmail(): string {
    return localStorage.getItem('email') || '';
  }

  getNameAndSurname(): string {
    const name = localStorage.getItem('name');
    const surname = localStorage.getItem('surname');
    return `${name} ${surname}`;
  }

  getUmcn(): string {
    return localStorage.getItem('umcn');
  }

  // tslint:disable-next-line:typedef
  verifyAccount(password, address, umcn, token) {
    console.log(`${this.baseUrl}/accountVerification`);
    return this.http.post(`${this.baseUrl}/accountVerification`, { password, address, umcn, token }, { responseType: 'text' });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';

  private loggedInStatus = new Subject<boolean>();
  loggedInStatus$ = this.loggedInStatus.asObservable();

  constructor(private http: HttpClient) {
  }


  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response) {
            this.storeSessionData(response);
            console.log(response.expiresAt);
            this.loggedInStatus.next(true);
          }
        })
      );
  }

  logout(): void {
    console.log('usao u logout');
    localStorage.clear();
    this.loggedInStatus.next(false);
  }

  signup(firstName: string, lastName: string, email: string, password: string, address: string, umcn: string): Observable<string> {
    return this.http.post(`${this.baseUrl}/signup`, { firstName, lastName, email, password, address, umcn }, { responseType: 'text' });
  }

  private storeSessionData(response: any): void {
    localStorage.setItem('authToken', response.authenticationToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    const expiresAt = response.expiresAt * 1000; // Pretvaranje trajanja u milisekunde i dodavanje na trenutno vreme
    console.log(expiresAt);
    localStorage.setItem('expiresAt', JSON.stringify(expiresAt));
    localStorage.setItem('email', response.email);
    console.log('Login successful, token stored:', response.authenticationToken);
  }

}

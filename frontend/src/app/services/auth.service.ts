import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LoginResponse } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private apiService: ApiService) { }

  login(email: string): Observable<any> {
    return this.apiService.post<any>('users/login', { email })
      .pipe(
        tap((response : LoginResponse) => {
          if (response && response.payload && response.payload.token) {
            sessionStorage.setItem('token', response.payload.token);
          }
        })
      );
  }

  logout() {
    sessionStorage.removeItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
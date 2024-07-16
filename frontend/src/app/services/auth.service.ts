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
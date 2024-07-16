import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = "http://localhost:3000/api";

  constructor(private http: HttpClient) { }

  // Método genérico para GET
  get<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, this.getHttpOptions(options))
      .pipe(
        map(this.extractData),
        tap(response => console.log('API Response:', response)),
        catchError(this.handleError)
      );
  }

  // Método genérico para POST
  post<T>(endpoint: string, data: any, options = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, this.getHttpOptions(options))
      .pipe(
        map(this.extractData),
        tap(response => console.log('API Response:', response)),
        catchError(this.handleError)
      );
  }

  // Método genérico para PUT
  put<T>(endpoint: string, data: any, options = {}): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, this.getHttpOptions(options))
      .pipe(
        map(this.extractData),
        tap(response => console.log('API Response:', response)),
        catchError(this.handleError)
      );
  }

  // Método genérico para DELETE
  delete<T>(endpoint: string, options = {}): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, this.getHttpOptions(options))
      .pipe(
        map(this.extractData),
        tap(response => console.log('API Response:', response)),
        catchError(this.handleError)
      );
  }

  // Método para extraer los datos de la respuesta
  private extractData<T>(response: HttpEvent<T>): T {
    if (response instanceof HttpResponse) {
      return response.body as T;
    }
    return {} as T;
  }

  // Método para manejar errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend retornó un código de error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Método para obtener las opciones HTTP (incluyendo headers)
  private getHttpOptions(options = {}): any {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const token = localStorage.getItem('token');
    if (token) {
      httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${token}`);
    }
    return { ...httpOptions, ...options };
  }
}
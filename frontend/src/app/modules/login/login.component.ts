import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../interfaces/auth.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService]
})
export class LoginComponent {
	email: string = '';
	error: boolean = false;
	errorMsg: string = '';
	loading: boolean = false;
	register: boolean = false;

	constructor(
		private apiService: ApiService,
		private router: Router
	){ 
		console.log("Login Component")
	}

	toggleRegister(){
		this.error = false
		this.register = this.register ? false : true
	}

	isValidEmail(email : string){
		return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) && email.length <= 50;
	}

	async registerUser(payload: any): Promise<void> {
		try {
			const response: any = await this.apiService.post('users', payload).toPromise();
			console.log('Registration successful', response);


			if (response && response.payload) {
				sessionStorage.setItem('userId', response.payload.id);
				sessionStorage.setItem('email', this.email);
				return
			} else {

				this.error = true;
				this.errorMsg = 'Invalid response from server';
			}
		} catch (error) {
			console.error('Registration failed', error);
			throw error; // Re-lanzar el error para que pueda ser manejado en onSubmit
		}
	}

	async onSubmit() {
		try {
			this.loading = true;
			this.error = false;
			this.errorMsg = '';
		
			if (!this.isValidEmail(this.email)) {
				this.error = true;
				this.errorMsg = 'Email or password invalid';
				return;
			}
		
			const payload = {
				email: this.email,
			};
		
			if (this.register) {
				await this.registerUser(payload);
			}
		
			// Convertimos la llamada al API en una promesa
			const response: any = await this.apiService.post('users/login', payload).toPromise();
		
			console.log('Login successful', response);
		
			if (response && response.payload) {
				sessionStorage.setItem('token', response.payload.token);
				sessionStorage.setItem('email', this.email);
				this.loading = false;
				this.router.navigate(['/dashboard']);
			} else {
				this.error = true;
				this.errorMsg = 'Invalid response from server';
			}
			
		} catch (error) {
			console.error('Login failed', error);
			this.handleError(error);
		} finally {
			this.loading = false;
		}
	}

	handleError(error: any){
		if (error.status === 404) {
			this.errorMsg = 'No data';
		} else if (error.status === 401) {
			this.errorMsg = 'Credenciales Inválidas';
		} else if (error.status === 409) {
			this.errorMsg = 'User already registered logging in...';
		} else if (error.status === 422) {
			this.errorMsg = 'Unprocessable Entity';
		} else {
			this.errorMsg = 'Unable to connect to server';
		}

		this.error = true;
		this.loading = false;
	}
}
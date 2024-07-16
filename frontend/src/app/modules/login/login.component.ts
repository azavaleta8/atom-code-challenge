import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import { LoginResponse } from '../../interfaces/auth.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  constructor(){ console.log("asdsad")}
  // constructor(private authService: AuthService) { console.log("asdsad")}

  onSubmit() {
    console.log(this.email)
    // this.authService.login(this.email).subscribe({
    //   next: (response : LoginResponse) => {
    //     console.log('Login successful', response);
    //     this.router.navigate(['/tasks']);
    //   },
    //   error: (error) => {
    //     console.error('Login failed', error);
    //     // Aquí puedes manejar los errores, como mostrar un mensaje al usuario
    //   }
    // });
  }
}
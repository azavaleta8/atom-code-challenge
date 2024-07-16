import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {
  label: string = 'Cerrar Sesion';
  email: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.logOut()
    }
  }

  logOut() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

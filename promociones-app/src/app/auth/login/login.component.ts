import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';

    const cleanUsername = this.username.trim();
    const cleanPassword = this.password.trim();

    if (!cleanUsername || !cleanPassword) {
      this.errorMessage = 'Usuario y contraseña son obligatorios.';
      return;
    }

    this.authService.login(cleanUsername, cleanPassword)
      .subscribe(users => {
        console.log('Respuesta backend:', users);

        if (users.length === 0) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          return;
        }

        const user = users[0];

        localStorage.setItem('currentUser', JSON.stringify(user));

        if (user.role === 'analyst') {
          this.router.navigate(['/analysts']);
        } else if (user.role === 'manager') {
          this.router.navigate(['/sales-management']);
        } else if (user.role === 'accounting') {
          this.router.navigate(['/sales-management']);
        } else {
          this.errorMessage = 'Rol no reconocido.';
        }
      }, error => {
        console.error(error);
        this.errorMessage = 'Error al conectar con el servidor.';
      });
  }
}

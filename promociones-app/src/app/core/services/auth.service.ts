import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://my-json-server.typicode.com/AValleO/challenge-json-db';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User[]> {
    const url = `${this.apiUrl}/users?username=${username}&password=${password}`;
    console.log('Consultando backend en:', url);
    return this.http.get<User[]>(url);
  }
}

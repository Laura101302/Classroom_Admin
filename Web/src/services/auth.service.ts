import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from 'src/interfaces/login';
import { IResponse } from 'src/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/login.php';
  authUrl: string = '';

  constructor(private http: HttpClient) {}

  signIn(body: Login) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { withCredentials: true, headers: headers };

    return this.http.post<IResponse>(this.url, body, options);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    if (localStorage.getItem('token')) return true;
    else return false;

    // return this.http.get<boolean>(`${this.url}`);

    // return token !== null && !this.isTokenExpired(token);
  }

  // isTokenExpired(token: string) {
  //   return false;
  // }
}

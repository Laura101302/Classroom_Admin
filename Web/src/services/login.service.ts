import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from 'src/interfaces/login';
import { IResponse } from 'src/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/login.php';

  constructor(private http: HttpClient) {}

  signIn(body: Login) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { withCredentials: true, headers: headers };

    return this.http.post<IResponse>(this.url, body, options);
  }

  logOut() {
    return;
  }
}
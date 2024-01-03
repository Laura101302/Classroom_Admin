import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/interfaces/response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/user.php';

  constructor(private http: HttpClient) {}

  updatePass(body: any) {
    return this.http.put<IResponse>(this.url, body);
  }
}

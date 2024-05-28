import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/interfaces/response';
import { Role } from 'src/interfaces/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/role.php';

  constructor(private http: HttpClient) {}

  getAllRoles() {
    return this.http.get<IResponse>(this.url);
  }

  getRoleById(id: number) {
    return this.http.get<IResponse>(this.url + `?id=${id}`);
  }

  createRole(body: Role) {
    return this.http.post<IResponse>(this.url, body);
  }

  editRole(body: Role) {
    return this.http.put<IResponse>(this.url, body);
  }
}

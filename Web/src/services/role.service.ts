import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/role.php';

  constructor(private http: HttpClient) {}

  getAllRoles() {
    return this.http.get<any>(this.url);
  }

  getRoleById(id: string) {
    return this.http.get<any>(this.url + `?id=${id}`);
  }

  createRole(body: any) {
    return this.http.post<any>(this.url, body);
  }

  editRole(body: any) {
    return this.http.put<any>(this.url, body);
  }
}

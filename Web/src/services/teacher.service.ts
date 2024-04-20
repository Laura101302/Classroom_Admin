import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponse } from 'src/interfaces/response';
import { Teacher } from 'src/interfaces/teacher';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/teacher.php';

  constructor(private http: HttpClient) {}

  getAllTeachers() {
    return this.http.get<IResponse>(this.url);
  }

  getAllTeachersByCif(cif: string) {
    return this.http.get<IResponse>(this.url + `?cif=${cif}`);
  }

  getTeacherByDni(dni: string) {
    return this.http.get<IResponse>(this.url + `?dni=${dni}`);
  }

  getTeacherByEmail(email: string) {
    return this.http.get<IResponse>(this.url + `?email=${email}`);
  }

  createTeacher(body: Teacher) {
    return this.http.post<IResponse>(this.url, body);
  }

  editTeacher(body: Teacher) {
    return this.http.put<IResponse>(this.url, body);
  }

  deleteTeacher(dni: string) {
    return this.http.delete<IResponse>(this.url + '/' + dni);
  }
}

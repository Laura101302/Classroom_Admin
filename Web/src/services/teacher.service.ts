import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher, TeacherResponse } from 'src/interfaces/teacher';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/teacher.php';

  constructor(private http: HttpClient) {}

  getAllTeachers() {
    return this.http.get<TeacherResponse>(this.url);
  }

  signUp(body: Teacher) {
    return this.http.post<TeacherResponse>(this.url, body);
  }

  signIn() {}

  logOut() {}
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/student.php';

  constructor(private http: HttpClient) {}

  getAllStudents() {
    return this.http.get<any>(this.url);
  }

  createStudent(body: any) {
    return this.http.post<any>(this.url, body);
  }

  signIn() {}

  logOut() {}
}

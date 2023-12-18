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

  getStudentByDni(dni: string) {
    return this.http.get<any>(this.url + '/' + dni);
  }

  createStudent(body: any) {
    return this.http.post<any>(this.url, body);
  }

  editStudent(body: any) {
    return this.http.put<any>(this.url, body);
  }

  signIn() {}

  logOut() {}

  deleteStudent(dni: string) {
    return this.http.delete<any>(this.url + '/' + dni);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  url: string = 'http://localhost/Classroom_Admin/API/controllers/course.php';

  constructor(private http: HttpClient) {}

  getAllCourses() {
    return this.http.get<any>(this.url);
  }

  createCourse(body: any) {
    return this.http.post<any>(this.url, body);
  }

  editCourse(body: any) {
    return this.http.put(this.url, body);
  }

  deleteCourse(code: string) {
    return this.http.delete(this.url + '/' + code);
  }
}

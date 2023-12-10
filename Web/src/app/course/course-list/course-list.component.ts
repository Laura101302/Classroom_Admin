import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/services/course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  error: boolean = false;

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => (this.courses = JSON.parse(res.response)),
      error: () => (this.error = true),
    });
  }

  edit(code: string) {
    this.router.navigate(['/courses/edit-course', code]);
  }
}

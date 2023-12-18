import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CenterService } from 'src/services/center.service';
import { CourseService } from 'src/services/course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];
  error: boolean = false;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private centerService: CenterService
  ) {}

  ngOnInit(): void {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => {
        const courses = JSON.parse(res.response);
        courses.forEach((course: any) => {
          this.getCenterByCif(course);
        });
      },
      error: () => (this.error = true),
    });
  }

  create() {
    this.router.navigate(['courses/create-course']);
  }

  edit(code: string) {
    this.router.navigate(['/courses/edit-course', code]);
  }

  getCenterByCif(course: any) {
    this.centerService.getCenterByCif(course.cif).subscribe((res) => {
      const center = JSON.parse(res.response)[0];
      this.courses.push({ ...course, center_name: center.name });
    });
  }
}

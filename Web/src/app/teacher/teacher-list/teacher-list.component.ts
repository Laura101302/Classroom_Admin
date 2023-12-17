import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from 'src/services/teacher.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class TeacherListComponent {
  teachers: any[] = [];
  error: boolean = false;
  deleted: boolean = false;
  deletedError: boolean = false;

  constructor(private teacherService: TeacherService, private router: Router) {}

  ngOnInit(): void {
    this.getAllTeachers();
  }

  getAllTeachers() {
    this.teacherService.getAllTeachers().subscribe({
      next: (res: any) => (this.teachers = JSON.parse(res.response)),
      error: () => (this.error = true),
    });
  }

  create() {
    this.router.navigate(['teachers/create-teacher']);
  }

  edit(dni: string) {
    this.router.navigate(['/teachers/edit-teacher', dni]);
  }

  delete(dni: string) {
    this.teacherService.deleteTeacher(dni).subscribe((res) => {
      if (res.code === 200) {
        this.deleted = true;
        this.deletedError = false;
        this.getAllTeachers();
        setTimeout(() => {
          this.deleted = false;
        }, 3000);
      } else {
        this.deleted = false;
        this.deletedError = true;
        setTimeout(() => {
          this.deletedError = false;
        }, 3000);
      }
    });
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from 'src/services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent {
  students: any[] = [];
  error: boolean = false;
  deleted: boolean = false;
  deletedError: boolean = false;

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.getAllStudents();
  }

  getAllStudents() {
    this.studentService.getAllStudents().subscribe({
      next: (res: any) => (this.students = JSON.parse(res.response)),
      error: () => (this.error = true),
    });
  }

  create() {
    this.router.navigate(['students/create-student']);
  }

  edit(dni: string) {
    this.router.navigate(['/students/edit-student', dni]);
  }

  delete(dni: string) {
    this.studentService.deleteStudent(dni).subscribe((res) => {
      if (res.code === 200) {
        this.deleted = true;
        this.deletedError = false;
        this.getAllStudents();
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

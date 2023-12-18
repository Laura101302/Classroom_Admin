import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Student, StudentResponse } from 'src/interfaces/student';
import { CourseService } from 'src/services/course.service';
import { StudentService } from 'src/services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;
  isEditing: boolean = false;
  student!: Student;
  courses!: any;

  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService
  ) {
    this.form = this.formBuilder.group({
      dni: ['', Validators.required],
      pass: ['', Validators.required],
      name: ['', Validators.required],
      surnames: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      code_course: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllCourses();
    const params = this.activatedRoute.snapshot.params;

    if (params['dni']) {
      this.isEditing = true;
      this.studentService.getStudentByDni(params['dni']).subscribe((res) => {
        this.student = JSON.parse(res.response)[0];

        this.form = this.formBuilder.group({
          dni: this.student.dni,
          pass: this.student.pass,
          name: this.student.name,
          surnames: this.student.surnames,
          phone: this.student.phone,
          email: this.student.email,
          birthdate: this.student.birthdate,
          code_course: this.student.code_course,
        });
      });
    }
  }

  createStudent() {
    this.studentService.createStudent(this.form.value).subscribe({
      next: (res: StudentResponse) => {
        if (res.code === 200) {
          this.created = true;
          this.error = false;
        }
      },
      error: (error) => {
        this.created = false;
        this.error = true;
        this.errorMessage = error.error.message;
      },
    });
  }

  editStudent() {
    this.studentService.editStudent(this.form.value).subscribe({
      next: (res: StudentResponse) => {
        if (res.code === 200) {
          this.created = true;
          this.error = false;
        }
      },
      error: (error) => {
        this.created = false;
        this.error = true;
        this.errorMessage = error.error.message;
      },
    });
  }

  getAllCourses() {
    this.courseService
      .getAllCourses()
      .subscribe((res) => (this.courses = JSON.parse(res.response)));
  }
}

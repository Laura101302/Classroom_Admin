import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from 'src/services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent {
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;

  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder
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

  createStudent() {
    this.studentService.createStudent(this.form.value).subscribe({
      next: (res: any) => {
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
}

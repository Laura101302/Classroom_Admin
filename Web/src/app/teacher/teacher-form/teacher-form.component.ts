import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherResponse } from 'src/interfaces/teacher';
import { TeacherService } from 'src/services/teacher.service';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss'],
})
export class TeacherFormComponent {
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;

  constructor(
    private teacherService: TeacherService,
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
      id_role: ['', Validators.required],
    });
  }

  createTeacher() {
    this.teacherService.createTeacher(this.form.value).subscribe({
      next: (res: TeacherResponse) => {
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

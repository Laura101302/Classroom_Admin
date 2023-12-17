import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Teacher, TeacherResponse } from 'src/interfaces/teacher';
import { TeacherService } from 'src/services/teacher.service';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss'],
})
export class TeacherFormComponent implements OnInit {
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;
  isEditing: boolean = false;
  teacher!: Teacher;

  constructor(
    private teacherService: TeacherService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
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

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;

    if (params['dni']) {
      this.isEditing = true;
      this.teacherService.getTeacherByDni(params['dni']).subscribe((res) => {
        this.teacher = JSON.parse(res.response)[0];

        this.form = this.formBuilder.group({
          dni: this.teacher.dni,
          pass: this.teacher.pass,
          name: this.teacher.name,
          surnames: this.teacher.surnames,
          phone: this.teacher.phone,
          email: this.teacher.email,
          birthdate: this.teacher.birthdate,
          id_role: this.teacher.id_role,
        });
      });
    }
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

  editTeacher() {
    this.teacherService.editTeacher(this.form.value).subscribe({
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

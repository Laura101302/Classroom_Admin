import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Center } from 'src/interfaces/center';
import { IResponse } from 'src/interfaces/response';
import { Role } from 'src/interfaces/role';
import { Teacher } from 'src/interfaces/teacher';
import { CenterService } from 'src/services/center.service';
import { RoleService } from 'src/services/role.service';
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
  centers!: Center[];
  selectedCenter!: Center | undefined;
  roles!: Role[];
  selectedRole!: Role | undefined;

  constructor(
    private teacherService: TeacherService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private centerService: CenterService,
    private roleService: RoleService
  ) {
    this.form = this.formBuilder.group({
      dni: ['', Validators.required],
      pass: ['', Validators.required],
      name: ['', Validators.required],
      surnames: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      center_cif: ['', Validators.required],
      role_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;

    this.getAllCenters();
    this.getAllRoles();

    if (params['dni']) {
      this.isEditing = true;
      this.teacherService.getTeacherByDni(params['dni']).subscribe((res) => {
        this.teacher = JSON.parse(res.response)[0];

        if (this.centers)
          this.selectedCenter = this.centers.find(
            (center) => center.cif === this.teacher.center_cif
          );

        if (this.roles)
          this.selectedRole = this.roles.find(
            (role) => role.id === this.teacher.role_id
          );

        this.form = this.formBuilder.group({
          dni: this.teacher.dni,
          pass: this.teacher.pass,
          name: this.teacher.name,
          surnames: this.teacher.surnames,
          phone: this.teacher.phone,
          email: this.teacher.email,
          birthdate: this.teacher.birthdate,
          center_cif: this.selectedCenter,
          role_id: this.selectedRole,
        });
      });
    }
  }

  getAllCenters() {
    this.centerService.getAllCenters().subscribe({
      next: (res) => (this.centers = JSON.parse(res.response)),
      error: (error) => console.log(error),
    });
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => (this.roles = JSON.parse(res.response)),
      error: (error) => console.log(error),
    });
  }

  createTeacher() {
    const form = {
      ...this.form.value,
      center_cif: this.form.value.center_cif.cif,
      role_id: this.form.value.role_id.id,
    };

    this.teacherService.createTeacher(form).subscribe({
      next: (res: IResponse) => {
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
    const form = {
      ...this.form.value,
      center_cif: this.form.value.center_cif.cif,
      role_id: this.form.value.role_id.id,
    };

    this.teacherService.editTeacher(form).subscribe({
      next: (res: IResponse) => {
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

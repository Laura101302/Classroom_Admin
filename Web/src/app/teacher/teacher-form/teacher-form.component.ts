import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  isEditing: boolean = false;
  teacher!: Teacher;
  centers!: Center[];
  selectedCenter!: Center | undefined;
  roles!: Role[];
  selectedRole!: Role | undefined;
  center!: string;
  isGlobalAdmin: boolean = false;

  constructor(
    private teacherService: TeacherService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private centerService: CenterService,
    private roleService: RoleService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.isEditing
      ? (this.form = this.formBuilder.group({
          dni: ['', Validators.required],
          name: ['', Validators.required],
          surnames: ['', Validators.required],
          phone: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          birthdate: ['', Validators.required],
          role_id: ['', Validators.required],
          center_cif: ['', Validators.required],
        }))
      : (this.form = this.formBuilder.group({
          dni: ['', Validators.required],
          name: ['', Validators.required],
          surnames: ['', Validators.required],
          phone: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          birthdate: ['', Validators.required],
          role_id: ['', Validators.required],
          pass: ['', Validators.required],
          center_cif: ['', Validators.required],
        }));
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    const center = localStorage.getItem('center');
    const role = localStorage.getItem('role');

    if (center) this.center = center;
    if (role && role === '0') {
      this.isGlobalAdmin = true;
      this.getAllCenters();
    }

    this.getAllRoles();

    if (params['dni']) {
      this.isEditing = true;
      this.teacherService.getTeacherByDni(params['dni'], false).subscribe({
        next: (res: IResponse) => {
          this.teacher = JSON.parse(res.response)[0];

          if (this.roles)
            this.selectedRole = this.roles.find(
              (role) => role.id === this.teacher.role_id
            );

          if (this.centers)
            this.selectedCenter = this.centers.find(
              (center) => center.cif === this.teacher.center_cif
            );

          this.form = this.formBuilder.group({
            dni: this.teacher.dni,
            name: this.teacher.name,
            surnames: this.teacher.surnames,
            phone: this.teacher.phone,
            email: this.teacher.email,
            birthdate: this.teacher.birthdate,
            role_id: this.selectedRole,
            pass: this.teacher.pass,
            center_cif: this.selectedCenter || this.center,
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al recuperar el profesor',
          });
        },
      });
    } else {
      if (!this.isGlobalAdmin)
        this.form.patchValue({
          center_cif: this.center,
        });
    }
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res) => {
        this.roles = JSON.parse(res.response);
        if (!this.isGlobalAdmin) this.roles.shift();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los roles',
        });
      },
    });
  }

  getAllCenters() {
    this.centerService.getAllCenters().subscribe({
      next: (res) => (this.centers = JSON.parse(res.response)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los centros',
        });
      },
    });
  }

  createTeacher() {
    const form = {
      ...this.form.value,
      role_id: this.form.value.role_id.id,
      center_cif: this.isGlobalAdmin
        ? this.form.value.center_cif.cif
        : this.center,
    };

    this.teacherService.createTeacher(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Creado correctamente',
          });

          setTimeout(() => {
            this.router.navigate(['teachers']);
          }, 2000);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el profesor',
        });
      },
    });
  }

  editTeacher() {
    const form = {
      ...this.form.value,
      role_id: this.form.value.role_id.id,
      center_cif: this.isGlobalAdmin
        ? this.form.value.center_cif.cif
        : this.center,
    };

    this.teacherService.editTeacher(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Editado',
            detail: 'Editado correctamente',
          });

          setTimeout(() => {
            this.router.navigate(['teachers']);
          }, 2000);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al editar el profesor',
        });
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { forkJoin, map } from 'rxjs';
import { Center } from 'src/interfaces/center';
import { IResponse } from 'src/interfaces/response';
import { Role } from 'src/interfaces/role';
import { Teacher } from 'src/interfaces/teacher';
import { CenterService } from 'src/services/center.service';
import { RoleService } from 'src/services/role.service';
import { ShowMessageService } from 'src/services/show-message.service';
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
  isAdmin: boolean = false;

  constructor(
    private teacherService: TeacherService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private centerService: CenterService,
    private roleService: RoleService,
    private router: Router,
    private showMessageService: ShowMessageService,
    private confirmationService: ConfirmationService
  ) {
    this.form = this.formBuilder.group({
      dni: ['', [Validators.required, Validators.pattern('^\\d{8}[A-Za-z]$')]],
      name: ['', Validators.required],
      surnames: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      role_id: ['', Validators.required],
      pass: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      center_cif: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    const center = localStorage.getItem('center');
    const role = localStorage.getItem('role');

    if (center) this.center = center;
    if (role) {
      if (role === '0') {
        this.isGlobalAdmin = true;

        forkJoin({
          centers: this.getAllCenters(),
          roles: this.getAllRoles(),
        }).subscribe({
          next: (res) => {
            this.centers = res.centers;
            this.roles = res.roles;

            if (params['dni']) this.setFormData(params['dni']);
          },
          error: () => {
            this.showMessageService.error('Error al recuperar los datos');
          },
        });
      } else if (role === '1') this.isAdmin = true;

      if (role !== '0') {
        forkJoin({
          roles: this.getAllRoles(),
        }).subscribe({
          next: (res) => {
            this.roles = res.roles;

            if (params['dni']) this.setFormData(params['dni']);
            else this.form.patchValue({ center_cif: this.center });
          },
          error: () => {
            this.showMessageService.error('Error al recuperar los datos');
          },
        });
      }
    }
  }

  getAllRoles() {
    return this.roleService.getAllRoles().pipe(
      map((res: IResponse) => {
        const roles = JSON.parse(res.response);
        if (!this.isGlobalAdmin) roles.shift();
        return roles;
      })
    );
  }

  getAllCenters() {
    return this.centerService
      .getAllCenters()
      .pipe(map((res: IResponse) => JSON.parse(res.response)));
  }

  setFormData(dni: string) {
    this.isEditing = true;
    this.teacherService.getTeacherByDni(dni, false).subscribe({
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
          dni: [
            this.teacher.dni,
            [Validators.required, Validators.pattern('^\\d{8}[A-Za-z]$')],
          ],
          name: [this.teacher.name, Validators.required],
          surnames: [this.teacher.surnames, Validators.required],
          phone: [this.teacher.phone, Validators.required],
          email: [
            { value: this.teacher.email, disabled: true },
            [Validators.required, Validators.email],
          ],
          birthdate: [this.teacher.birthdate, Validators.required],
          role_id: [this.selectedRole, Validators.required],
          pass: this.teacher.pass,
          center_cif: [this.selectedCenter || this.center, Validators.required],
        });
      },
      error: () => {
        this.showMessageService.error('Error al recuperar el profesor');
      },
    });
  }

  createTeacher() {
    const form = {
      ...this.form.value,
      role_id: this.form.value.role_id.id,
      center_cif: this.isGlobalAdmin
        ? this.form.value.center_cif === 'null'
          ? null
          : this.form.value.center_cif.cif
        : this.center,
    };

    this.teacherService.createTeacher(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.showMessageService.success('Creado', 'Creado correctamente');

          setTimeout(() => {
            this.router.navigate(['teachers']);
          }, 2000);
        }
      },
      error: (error) => {
        if (error.error.message === 'DNI already in use') {
          this.showMessageService.error('El DNI ya está en uso');
        } else if (error.error.message === 'Email already in use') {
          this.showMessageService.error('El email ya está en uso');
        } else if (error.error.message === 'Invalid dni format') {
          this.showMessageService.error('El formato de DNI es incorrecto');
        } else if (error.error.message === 'Invalid email format') {
          this.showMessageService.error('El formato de email es incorrecto');
        } else if (error.error.message === 'Invalid pass format') {
          this.showMessageService.error(
            'El formato de contraseña es incorrecto'
          );
        } else {
          this.showMessageService.error('Error al crear el profesor');
        }
      },
    });
  }

  editTeacher() {
    this.form.get('email')?.enable();

    const form = {
      ...this.form.value,
      role_id: this.form.value.role_id.id,
      center_cif: this.isGlobalAdmin
        ? this.form.value.center_cif === 'null'
          ? null
          : this.form.value.center_cif.cif
        : this.center,
    };

    this.form.get('email')?.disable();

    this.teacherService.editTeacher(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.showMessageService.success('Editado', 'Editado correctamente');

          setTimeout(() => {
            if (this.isAdmin || this.isGlobalAdmin)
              this.router.navigate(['teachers']);
            else this.router.navigate(['']);
          }, 2000);
        }
      },
      error: () => {
        this.showMessageService.error('Error al editar el profesor');
      },
    });
  }

  showPassInfo() {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      header: 'Información',
      icon: 'pi pi-info-circle',

      accept: () => {},
    });
  }

  resetForm() {
    this.form.reset();
    this.form.get('email')?.setValue(this.teacher.email);
  }

  goBack() {
    if (
      this.isEditing &&
      this.form.get('email')?.value === localStorage.getItem('user')
    )
      this.router.navigate(['']);
    else this.router.navigate(['teachers']);
  }
}

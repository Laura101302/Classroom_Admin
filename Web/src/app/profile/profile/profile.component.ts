import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IResponse } from 'src/interfaces/response';
import { Teacher } from 'src/interfaces/teacher';
import { CenterService } from 'src/services/center.service';
import { RoleService } from 'src/services/role.service';
import { TeacherService } from 'src/services/teacher.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user!: Teacher;
  userEmail!: string | null;
  isLogOut: boolean = false;

  constructor(
    private teacherService: TeacherService,
    private centerService: CenterService,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('user');

    if (this.userEmail)
      this.teacherService.getTeacherByEmail(this.userEmail).subscribe({
        next: (res: IResponse) => {
          const user = JSON.parse(res.response)[0];
          this.getCenterName(user);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al recuperar los datos',
          });
        },
      });
  }

  getCenterName(user: Teacher) {
    this.centerService.getCenterByCif(user.center_cif).subscribe({
      next: (res: IResponse) => {
        this.user = {
          ...user,
          center_cif: JSON.parse(res.response)[0].name,
        };

        this.getRoleName(this.user);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los datos',
        });
      },
    });
  }

  getRoleName(user: Teacher) {
    this.roleService.getRoleById(user.role_id).subscribe({
      next: (res: IResponse) => {
        this.user = {
          ...user,
          role_id: JSON.parse(res.response)[0].name,
        };
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los datos',
        });
      },
    });
  }

  warningDeleteAccount(user: Teacher) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: '¿Estás seguro? Se eliminará la cuenta de usuario',
      header: 'Eliminar cuenta',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.deleteAccount(user.dni);
      },
      reject: () => {},
    });
  }

  deleteAccount(dni: string) {
    this.teacherService.deleteTeacher(dni).subscribe({
      next: () => {
        this.logOut();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la cuenta',
        });
      },
    });
  }

  warningLogOut() {
    this.isLogOut = true;

    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: '¿Estás seguro? Tendrás que volver a iniciar sesión',
      header: 'Cerrar sesión',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.isLogOut = false;
        this.logOut();
      },
      reject: () => {
        this.isLogOut = false;
      },
    });
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('center');
    localStorage.removeItem('role');

    window.location.reload();
  }
}

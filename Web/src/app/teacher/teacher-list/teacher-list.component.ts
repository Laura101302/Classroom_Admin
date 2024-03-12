import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable, forkJoin, map } from 'rxjs';
import { IResponse } from 'src/interfaces/response';
import { Teacher } from 'src/interfaces/teacher';
import { CenterService } from 'src/services/center.service';
import { RoleService } from 'src/services/role.service';
import { TeacherService } from 'src/services/teacher.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class TeacherListComponent {
  @ViewChild('dt1') dt1: Table | undefined;
  teachers: Teacher[] = [];
  error: boolean = false;
  isLoading: boolean = false;

  constructor(
    private teacherService: TeacherService,
    private router: Router,
    private centerService: CenterService,
    private roleService: RoleService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllTeachers();
  }

  getAllTeachers() {
    this.isLoading = true;

    this.teacherService.getAllTeachers().subscribe({
      next: (res: IResponse) => {
        const teacherArray = JSON.parse(res.response);

        const observablesArray = teacherArray.map((teacher: Teacher) => {
          return forkJoin({
            center: this.getCenterByCif(teacher.center_cif),
            role: this.getRoleById(teacher.role_id),
          }).pipe(
            map((data) => ({
              ...teacher,
              center_cif: data.center.name,
              role_id: data.role.name,
            }))
          );
        });

        forkJoin(observablesArray).subscribe({
          next: (res) => {
            this.teachers = res as Teacher[];
            this.isLoading = false;
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al recuperar los datos',
            });

            this.error = true;
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los profesores',
        });

        this.error = true;
        this.isLoading = false;
      },
    });
  }

  getCenterByCif(centerCif: string): Observable<any> {
    return this.centerService
      .getCenterByCif(centerCif)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0]));
  }

  getRoleById(role_id: number): Observable<any> {
    return this.roleService
      .getRoleById(role_id)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0]));
  }

  create() {
    this.router.navigate(['teachers/create-teacher']);
  }

  edit(dni: string) {
    this.router.navigate(['/teachers/edit-teacher', dni]);
  }

  delete(dni: string) {
    this.isLoading = true;

    this.teacherService.deleteTeacher(dni).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Profesor eliminado correctamente',
          });
          this.getAllTeachers();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el profesor',
          });
          this.isLoading = false;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el profesor',
        });
      },
    });
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }

  clearFilter(table: Table) {
    table.clear();
  }
}

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { TeacherService } from 'src/services/teacher.service';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class TeacherListComponent {
  @ViewChild('dt1') dt1: Table | undefined;
  teachers: any[] = [];
  error: boolean = false;
  deleted: boolean = false;
  deletedError: boolean = false;
  isLoading: boolean = false;

  constructor(private teacherService: TeacherService, private router: Router) {}

  ngOnInit(): void {
    this.getAllTeachers();
  }

  getAllTeachers() {
    this.isLoading = true;

    this.teacherService.getAllTeachers().subscribe({
      next: (res: any) => {
        this.teachers = JSON.parse(res.response);
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      },
    });
  }

  create() {
    this.router.navigate(['teachers/create-teacher']);
  }

  edit(dni: string) {
    this.router.navigate(['/teachers/edit-teacher', dni]);
  }

  delete(dni: string) {
    this.isLoading = true;

    this.teacherService.deleteTeacher(dni).subscribe((res) => {
      if (res.code === 200) {
        this.deleted = true;
        this.deletedError = false;
        this.getAllTeachers();
        setTimeout(() => {
          this.deleted = false;
        }, 3000);
      } else {
        this.deleted = false;
        this.deletedError = true;
        this.isLoading = false;
        setTimeout(() => {
          this.deletedError = false;
        }, 3000);
      }
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

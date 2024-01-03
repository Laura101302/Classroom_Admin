import { Component, OnInit } from '@angular/core';
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

  constructor(
    private teacherService: TeacherService,
    private centerService: CenterService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('user');

    if (this.userEmail)
      this.teacherService.getTeacherByEmail(this.userEmail).subscribe({
        next: (res: IResponse) => {
          const user = JSON.parse(res.response)[0];
          this.getCenterName(user);
        },
        error: (error) => {
          console.log(error);
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
      error: (error) => {
        console.log(error);
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
      error: (error) => {
        console.log(error);
      },
    });
  }

  deleteAccount(dni: string) {
    this.teacherService.deleteTeacher(dni).subscribe({
      next: (res: IResponse) => {
        this.logOut();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }
}

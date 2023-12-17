import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from 'src/services/role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent {
  roles: any[] = [];
  error: boolean = false;
  deleted: boolean = false;
  deletedError: boolean = false;

  constructor(private roleService: RoleService, private router: Router) {}

  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res: any) => (this.roles = JSON.parse(res.response)),
      error: () => (this.error = true),
    });
  }

  edit(id: number) {
    this.router.navigate(['/roles/edit-role', id]);
  }

  delete(id: number) {
    this.roleService.deleteRole(id).subscribe((res) => {
      if (res.code === 200) {
        this.deleted = true;
        this.deletedError = false;
        this.getAllRoles();
        setTimeout(() => {
          this.deleted = false;
        }, 3000);
      } else {
        this.deleted = false;
        this.deletedError = true;
        setTimeout(() => {
          this.deletedError = false;
        }, 3000);
      }
    });
  }
}

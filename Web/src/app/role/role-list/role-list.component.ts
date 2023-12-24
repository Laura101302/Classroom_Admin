import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { RoleService } from 'src/services/role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent {
  @ViewChild('dt1') dt1: Table | undefined;
  roles: any[] = [];
  error: boolean = false;
  isLoading: boolean = false;

  constructor(private roleService: RoleService, private router: Router) {}

  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles() {
    this.isLoading = true;

    this.roleService.getAllRoles().subscribe({
      next: (res: any) => {
        this.roles = JSON.parse(res.response);
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      },
    });
  }

  edit(id: number) {
    this.router.navigate(['/roles/edit-role', id]);
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

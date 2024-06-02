import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IResponse } from 'src/interfaces/response';
import { Role } from 'src/interfaces/role';
import { RoleService } from 'src/services/role.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent {
  @ViewChild('dt1') dt1: Table | undefined;
  roles: Role[] = [];
  error: boolean = false;

  constructor(
    private roleService: RoleService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res: IResponse) => {
        this.roles = JSON.parse(res.response);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los roles',
        });

        this.error = true;
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

  contains(selector: string, text: string) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
      return RegExp(text).test(element.textContent);
    });
  }

  filterOpen() {
    let element = this.contains('span', 'Clear')[0];
    if (element && element !== undefined) {
      element.textContent = 'Limpiar';
    }

    let element2 = this.contains('span', 'Apply')[0];
    if (element2 && element2 !== undefined) {
      element2.textContent = 'Aplicar';
    }
  }
}

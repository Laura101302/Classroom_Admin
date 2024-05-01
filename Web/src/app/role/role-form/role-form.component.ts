import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IResponse } from 'src/interfaces/response';
import { Role } from 'src/interfaces/role';
import { RoleService } from 'src/services/role.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent implements OnInit {
  form!: FormGroup;
  role!: Role;

  constructor(
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.roleService.getRoleById(params['id']).subscribe({
        next: (res: IResponse) => {
          this.role = JSON.parse(res.response)[0];

          this.form = this.formBuilder.group({
            id: this.role.id,
            name: this.role.name,
          });
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
  }

  editRole() {
    this.roleService.editRole(this.form.value).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Editado',
            detail: 'Editado correctamente',
          });

          setTimeout(() => {
            this.router.navigate(['roles']);
          }, 2000);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al editar el rol',
        });
      },
    });
  }

  goBack() {
    this.router.navigate(['roles']);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;
  role!: Role;

  constructor(
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    if (params['id']) {
      this.roleService.getRoleById(params['id']).subscribe((res: IResponse) => {
        this.role = JSON.parse(res.response)[0];

        this.form = this.formBuilder.group({
          id: this.role.id,
          name: this.role.name,
        });
      });
    }
  }

  editRole() {
    this.roleService.editRole(this.form.value).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.created = true;
          this.error = false;
        }
      },
      error: (error) => {
        this.created = false;
        this.error = true;
        this.errorMessage = error.error.message;
      },
    });
  }

  goBack() {
    this.router.navigate(['roles']);
  }
}

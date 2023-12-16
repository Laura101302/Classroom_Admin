import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from 'src/services/role.service';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
})
export class RoleFormComponent {
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;

  constructor(
    private roleService: RoleService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  editRole() {
    this.roleService.editRole(this.form.value).subscribe({
      next: (res: any) => {
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
}

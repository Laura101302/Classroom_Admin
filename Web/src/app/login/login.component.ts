import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResponse } from 'src/interfaces/response';
import { LoginService } from 'src/services/login.service';
import { TeacherService } from 'src/services/teacher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form!: FormGroup;
  error: boolean = false;
  errorMessage!: string;

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', Validators.required],
    });
  }

  login() {
    this.loginService.signIn(this.form.value).subscribe({
      next: (res: IResponse) => {
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}

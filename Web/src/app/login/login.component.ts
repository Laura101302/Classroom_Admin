import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from 'src/interfaces/response';
import { AuthService } from 'src/services/auth.service';
import { ShowMessageService } from 'src/services/show-message.service';
import { TeacherService } from 'src/services/teacher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private teacherService: TeacherService,
    private showMessageService: ShowMessageService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.isAuthenticated();
  }

  signIn() {
    this.authService.signIn(this.form.value).subscribe({
      next: (res: IResponse) => {
        if (res.status === 'ok') {
          this.teacherService
            .getTeacherByEmail(this.form.value.email)
            .subscribe({
              next: (teacherRes: IResponse) => {
                const user = JSON.parse(teacherRes.response)[0];

                localStorage.setItem('token', res.response);
                localStorage.setItem('user', this.form.value.email);
                localStorage.setItem('center', user.center_cif);
                localStorage.setItem('role', user.role_id);

                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });
              },
              error: () => {
                this.showMessageService.error('Error al recuperar los datos');
              },
            });
        }
      },
      error: () => {
        this.showMessageService.error(
          'El usuario o la contraseña son incorrectos'
        );
      },
    });
  }

  isAuthenticated() {
    if (this.authService.isAuthenticated()) this.router.navigate(['/']);
  }
}

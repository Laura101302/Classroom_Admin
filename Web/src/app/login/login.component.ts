import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from 'src/interfaces/response';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error: boolean = false;
  errorMessage!: string;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
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
          localStorage.setItem('token', res.response);
          localStorage.setItem('user', this.form.value.email);
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  isAuthenticated() {
    if (this.authService.isAuthenticated()) this.router.navigate(['/']);
  }
}

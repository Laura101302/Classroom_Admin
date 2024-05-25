import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowMessageService } from 'src/services/show-message.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-pass',
  templateUrl: './update-pass.component.html',
  styleUrl: './update-pass.component.scss',
})
export class UpdatePassComponent implements OnInit {
  form!: FormGroup;
  email!: string | null;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private showMessageService: ShowMessageService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('user');

    this.activatedRoute.queryParams.subscribe((params) => {
      const email = params['email'];
      if (email) this.email = email;
    });

    if (this.email) {
      this.form = this.formBuilder.group({
        email: { value: this.email, disabled: true },
        pass: '',
      });
    }
  }

  updatePass() {
    const obj = {
      email: this.email,
      pass: this.form.value['pass'],
    };

    this.userService.updatePass(obj).subscribe({
      next: () => {
        this.showMessageService.success('Editada', 'Editada correctamente');

        setTimeout(() => {
          if (this.email === localStorage.getItem('user'))
            this.router.navigate(['']);
          else this.router.navigate(['teachers']);
        }, 2000);
      },
      error: () => {
        this.showMessageService.error('Error al editar la contraseña');
      },
    });
  }

  goBack() {
    if (this.email === localStorage.getItem('user')) this.router.navigate(['']);
    else this.router.navigate(['teachers']);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IResponse } from 'src/interfaces/response';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-pass',
  templateUrl: './update-pass.component.html',
  styleUrl: './update-pass.component.scss',
})
export class UpdatePassComponent implements OnInit {
  form!: FormGroup;
  edited: boolean = false;
  error: boolean = false;
  errorMessage!: string;
  email!: string | null;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('user');

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
      next: (res: IResponse) => {
        this.edited = true;
      },
      error: (error) => {
        this.error = true;
        this.errorMessage = error.error.message;
      },
    });
  }
}

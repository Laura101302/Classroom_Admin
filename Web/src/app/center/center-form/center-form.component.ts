import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CenterService } from 'src/services/center.service';

@Component({
  selector: 'app-center-form',
  templateUrl: './center-form.component.html',
  styleUrls: ['./center-form.component.scss'],
})
export class CenterFormComponent {
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;

  constructor(
    private centerService: CenterService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      cif: ['', Validators.required],
      name: ['', Validators.required],
      direction: ['', Validators.required],
      postal_code: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
    });
  }

  createCenter() {
    this.centerService.createCenter(this.form.value).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          this.created = true;
          this.error = false;
        }
      },
      error: (error: any) => {
        this.created = false;
        this.error = true;
        this.errorMessage = error.error.message;
      },
    });
  }
}

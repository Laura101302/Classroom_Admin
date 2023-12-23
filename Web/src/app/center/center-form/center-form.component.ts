import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CenterService } from 'src/services/center.service';

@Component({
  selector: 'app-center-form',
  templateUrl: './center-form.component.html',
  styleUrls: ['./center-form.component.scss'],
})
export class CenterFormComponent implements OnInit {
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;
  isEditing: boolean = false;
  center!: any;

  constructor(
    private centerService: CenterService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
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

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;

    if (params['cif']) {
      this.isEditing = true;
      this.centerService.getCenterByCif(params['cif']).subscribe((res) => {
        this.center = JSON.parse(res.response)[0];

        this.form = this.formBuilder.group({
          cif: this.center.cif,
          name: this.center.name,
          direction: this.center.direction,
          postal_code: this.center.postal_code,
          city: this.center.city,
          province: this.center.province,
        });
      });
    }
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

  editCenter() {
    this.centerService.editCenter(this.form.value).subscribe({
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Center } from 'src/interfaces/center';
import { IResponse } from 'src/interfaces/response';
import { CenterService } from 'src/services/center.service';
import { ShowMessageService } from 'src/services/show-message.service';

@Component({
  selector: 'app-center-form',
  templateUrl: './center-form.component.html',
  styleUrls: ['./center-form.component.scss'],
})
export class CenterFormComponent implements OnInit {
  form!: FormGroup;
  isEditing: boolean = false;
  center!: Center;

  constructor(
    private centerService: CenterService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private showMessageService: ShowMessageService
  ) {
    this.form = this.formBuilder.group({
      cif: ['', [Validators.required, Validators.pattern('^[A-Za-z]\\d{8}$')]],
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
          cif: [
            this.center.cif,
            [Validators.required, Validators.pattern('^[A-Za-z]\\d{8}$')],
          ],
          name: [this.center.name, Validators.required],
          direction: [this.center.direction, Validators.required],
          postal_code: [this.center.postal_code, Validators.required],
          city: [this.center.city, Validators.required],
          province: [this.center.province, Validators.required],
        });

        this.form.get('cif')?.disable();
      });
    }
  }

  createCenter() {
    this.centerService.createCenter(this.form.value).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.showMessageService.success('Creado', 'Creado correctamente');

          setTimeout(() => {
            this.router.navigate(['centers']);
          }, 2000);
        }
      },
      error: (error) => {
        if (error.error.message === 'CIF already in use')
          this.showMessageService.error('El CIF ya está en uso');
        else if (error.error.message === 'Invalid cif format')
          this.showMessageService.error('El formato del CIF es incorrecto');
        else
          this.showMessageService.error(
            'Ha ocurrido un error al crear el centro'
          );
      },
    });
  }

  editCenter() {
    this.form.get('cif')?.enable();

    this.centerService.editCenter(this.form.value).subscribe({
      next: (res: any) => {
        this.form.get('cif')?.disable();

        if (res.code === 200) {
          this.showMessageService.success('Editado', 'Editado correctamente');

          setTimeout(() => {
            this.router.navigate(['centers']);
          }, 2000);
        }
      },
      error: () => {
        this.form.get('cif')?.disable();
        this.showMessageService.error(
          'Ha ocurrido un error al editar el centro'
        );
      },
    });
  }

  resetForm() {
    this.form.reset();
    if (this.isEditing) this.form.get('cif')?.setValue(this.center.cif);
  }
}

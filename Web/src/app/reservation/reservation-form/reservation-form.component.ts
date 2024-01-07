import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { IResponse } from 'src/interfaces/response';
import { CenterService } from 'src/services/center.service';
import { ReservationService } from 'src/services/reservation.service';
import { RoomService } from 'src/services/room.service';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.scss',
})
export class ReservationFormComponent implements OnInit {
  params!: any;
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;
  email!: string | null;
  center!: string | null;

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private centerService: CenterService,
    private reservationService: ReservationService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      room: [{ value: '', disabled: true }, Validators.required],
      center: [{ value: '', disabled: true }, Validators.required],
      whole_room: [],
    });
  }

  ngOnInit(): void {
    this.params = this.activatedRoute.snapshot.params;

    this.email = localStorage.getItem('user');
    this.center = localStorage.getItem('center');

    if (this.email && this.center) {
      this.form.patchValue({ email: this.email });
      this.getRoomById(this.params['id']);
      this.getCenterByCif(this.center);
    }
  }

  createReserve() {
    const body = {
      id: this.form.value['id'],
      room_id: this.params['id'],
      teacher_email: this.email,
    };

    this.reservationService.createReserve(body).subscribe({
      next: (res: IResponse) => {
        this.roomService.updateState(this.params['id'], 2).subscribe({
          next: (res) => {
            if (res.code === 200) {
              this.created = true;
              this.error = false;
              setTimeout(() => {
                this.router.navigate(['my-reserves']);
              }, 2000);
            }
          },
          error: (error) => {
            this.created = false;
            this.error = true;
            this.errorMessage = error.error.message;
          },
        });
      },
      error: (error) => {
        this.created = false;
        this.error = true;
        this.errorMessage = error.error.message;
      },
    });
  }

  getCenterByCif(centerCif: string) {
    this.centerService.getCenterByCif(centerCif).subscribe({
      next: (res: IResponse) =>
        this.form.patchValue({ center: JSON.parse(res.response)[0].name }),
      error: () => (this.error = true),
    });
  }

  getRoomById(room_id: number) {
    this.roomService.getRoomById(room_id).subscribe({
      next: (res: IResponse) => {
        this.form.patchValue({ room: JSON.parse(res.response)[0].name });
      },
      error: () => (this.error = true),
    });
  }
}

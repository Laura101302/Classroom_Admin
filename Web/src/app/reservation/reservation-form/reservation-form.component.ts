import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reserve } from 'src/interfaces/reserve';
import { IResponse } from 'src/interfaces/response';
import { Seat } from 'src/interfaces/seat';
import { CenterService } from 'src/services/center.service';
import { ReservationService } from 'src/services/reservation.service';
import { RoomService } from 'src/services/room.service';
import { SeatService } from 'src/services/seat.service';

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
  seats!: Seat[];
  selectedSeat!: Seat | undefined;
  isChecked!: boolean;
  isDisabled!: boolean;

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private centerService: CenterService,
    private reservationService: ReservationService,
    private router: Router,
    private seatService: SeatService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      room: [{ value: '', disabled: true }, Validators.required],
      seat_id: ['', Validators.required],
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
      this.getAvailableSeatsByRoomId(this.params['id']);
      this.getCenterByCif(this.center);
    }
  }

  createReserve() {
    const body = {
      id: this.form.value['id'],
      room_id: this.params['id'],
      seat_id: this.selectedSeat?.id,
      teacher_email: this.email,
    } as Reserve;

    this.reservationService.createReserve(body).subscribe({
      next: (res: IResponse) => {
        if (this.selectedSeat) {
          this.seatService
            .updateState(this.selectedSeat.id, 0)
            .subscribe((res: IResponse) => {
              const availableSeats = this.getAvailableSeatsByRoomId(
                this.params['id']
              );
            });
        } else this.updateRoomState();
      },
      error: (error) => {
        this.created = false;
        this.error = true;
        this.errorMessage = error.error.message;
      },
    });
  }

  getRoomById(room_id: number) {
    setTimeout(() => {
      this.roomService.getRoomById(room_id).subscribe({
        next: (res: IResponse) => {
          const response = JSON.parse(res.response)[0];

          switch (response.reservation_type) {
            case 1: // Entera
              this.form.get('seat_id')?.setValue('');
              this.form.get('seat_id')?.disable();
              this.isChecked = true;
              this.isDisabled = true;
              break;
            case 2: // Individual
              this.isChecked = false;
              this.isDisabled = true;
              break;
            case 3: // Entera / Individual
              this.isChecked = false;
              this.isDisabled = false;
              break;
            default:
              console.log(response.reservation_type);
              break;
          }

          this.form.patchValue({ room: response.name });
        },
        error: () => (this.error = true),
      });
    }, 0);
  }

  getAvailableSeatsByRoomId(room_id: number) {
    this.seatService.getAvailableSeatsByRoomId(room_id).subscribe({
      next: (res: IResponse) => {
        this.seats = JSON.parse(res.response);
        return this.seats;
      },
      error: (error) => console.log(error),
    });
  }

  getCenterByCif(centerCif: string) {
    this.centerService.getCenterByCif(centerCif).subscribe({
      next: (res: IResponse) =>
        this.form.patchValue({ center: JSON.parse(res.response)[0].name }),
      error: () => (this.error = true),
    });
  }

  updateRoomState() {
    this.roomService.updateState(this.params['id'], 0).subscribe({
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
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { forkJoin, map, of } from 'rxjs';
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
  email!: string | null;
  seats!: Seat[];
  selectedSeat!: Seat | undefined;
  isChecked!: boolean;
  isDisabled!: boolean;
  showCheckbox: boolean = true;
  showDropdown: boolean = true;
  minDate!: Date;
  disabledDates!: Date[];
  reservationType!: number;

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private centerService: CenterService,
    private reservationService: ReservationService,
    private router: Router,
    private seatService: SeatService,
    private messageService: MessageService,
    private primeNGConfig: PrimeNGConfig,
    private translateService: TranslateService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      room: [{ value: '', disabled: true }, Validators.required],
      seat_id: ['', Validators.required],
      whole_room: [],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.translateService.setDefaultLang('es');
    this.translate('es');
    this.params = this.activatedRoute.snapshot.params;
    this.email = localStorage.getItem('user');
    this.minDate = new Date();

    if (this.email) {
      forkJoin({
        room: this.getRoomById(this.params['id']),
        allSeats: this.getAllSeatsByRoomId(this.params['id']),
      }).subscribe({
        next: (res) => {
          this.form.patchValue({ room: res.room.name });
          this.seats = res.allSeats;

          if (res.allSeats.length > this.seats.length) this.isDisabled = true;

          if (
            res.room.reservation_type === 1 ||
            (res.room.reservation_type === 3 && !this.isDisabled)
          ) {
            this.disabledDates = [];

            this.getAllReservesDateByRoomId().subscribe({
              next: (res) => {
                res.forEach((item: any) => {
                  const date = item.date.split('/');
                  this.disabledDates.push(
                    new Date(date[2], date[1] - 1, date[0])
                  );
                });
              },
              error: () => {
                this.showErrorMessage('Error al recuperar las fechas');
              },
            });
          }
        },
      });
    }
  }

  checkAvailability() {
    const body = {
      id: this.form.value['id'],
      date: this.form.value['date'],
      room_id: this.params['id'],
      seat_id: this.selectedSeat?.id,
      teacher_email: this.email,
    } as Reserve;

    if (this.selectedSeat) {
      forkJoin({
        reserves: this.getAllReservesDateBySeatId(this.selectedSeat.id),
      }).subscribe({
        next: (res: any) => {
          const selectedDate = this.formatDate(this.form.value['date']);
          const match = res.reserves.some(
            (item: any) => item.date === selectedDate
          );

          if (match) {
            this.showErrorMessage(
              'Ya existe una reserva para la fecha seleccionada'
            );
          } else this.createReserve(body);
        },
        error: () => {
          this.showErrorMessage('Error al recuperar las reservas');
        },
      });
    } else {
      forkJoin({
        reserves: this.getAllReservesDateByRoomId(),
      }).subscribe({
        next: (res: any) => {
          const selectedDate = this.formatDate(this.form.value['date']);
          const match = res.reserves.some(
            (item: any) => item.date === selectedDate
          );

          if (match) {
            this.showErrorMessage(
              'Ya existe una reserva para la fecha seleccionada'
            );
          } else this.createReserve(body);
        },
        error: () => {
          this.showErrorMessage('Error al recuperar las reservas');
        },
      });
    }
  }

  createReserve(body: Reserve) {
    const selected = this.formatDate(body.date as unknown as Date);
    const today = this.formatDate(new Date());

    const observables = {
      reserve: this.reservationService.createReserve(body),
      update:
        selected === today
          ? this.selectedSeat
            ? this.seatService.updateState(this.selectedSeat.id, 0)
            : this.updateRoomState(true)
          : of(null),
    };
    forkJoin(observables).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Reservada',
          detail: 'Reservada correctamente',
        });

        setTimeout(() => {
          this.router.navigate(['my-reserves']);
        }, 2000);
      },
      error: () => {
        this.showErrorMessage('Error al crear la reserva');
      },
    });
  }

  getRoomById(room_id: number) {
    return this.roomService.getRoomById(room_id).pipe(
      map((res: IResponse) => {
        const response = JSON.parse(res.response)[0];
        this.reservationType = response.reservation_type;

        switch (response.reservation_type) {
          case 1: // Entera
            this.form.get('seat_id')?.setValue('');
            this.form.get('seat_id')?.disable();
            this.isChecked = true;
            this.isDisabled = true;
            this.showDropdown = false;
            break;
          case 2: // Individual
            this.isChecked = false;
            this.showCheckbox = false;
            break;
          case 3: // Entera / Individual
            this.isChecked = false;
            this.isDisabled = false;
            break;
          default:
            console.log(response.reservation_type);
            break;
        }

        return {
          name: response.name,
          reservation_type: response.reservation_type,
        };
      })
    );
  }

  getAllSeatsByRoomId(room_id: number) {
    return this.seatService
      .getAllSeatsByRoomId(room_id)
      .pipe(map((res: IResponse) => JSON.parse(res.response)));
  }

  getCenterByCif(centerCif: string) {
    return this.centerService
      .getCenterByCif(centerCif)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0].name));
  }

  updateRoomState(fullRoom: boolean) {
    if (fullRoom)
      return forkJoin({
        updateState: this.roomService.updateState(this.params['id'], 0),
        updateSeatStateByRoomId: this.seatService.updateSeatStateByRoomId(
          this.params['id'],
          0
        ),
      }).pipe(map((res) => res));
    else
      return forkJoin({
        updateState: this.roomService.updateState(this.params['id'], 0),
      }).pipe(map((res) => res));
  }

  checkbox(event: any) {
    this.isChecked = event.checked;

    if (this.isChecked) {
      this.form.get('seat_id')?.setValue('');
      this.form.get('seat_id')?.disable();
    } else this.form.get('seat_id')?.enable();
  }

  translate(lang: string) {
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .subscribe((res) => this.primeNGConfig.setTranslation(res));
  }

  getAllReservesDateBySeatId(seat_id: number) {
    return this.reservationService
      .getAllReservesDateBySeatId(seat_id)
      .pipe(map((res) => JSON.parse(res.response)));
  }

  getAllReservesDateByRoomId() {
    return this.reservationService
      .getAllReservesDateByRoomId(this.params['id'])
      .pipe(map((res) => JSON.parse(res.response)));
  }

  formatDate(date: Date) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  onChangeDropdown(event: any) {
    this.disabledDates = [];

    this.getAllReservesDateBySeatId(event.value.id).subscribe({
      next: (res) => {
        res.forEach((item: any) => {
          const date = item.date.split('/');
          this.disabledDates.push(new Date(date[2], date[1] - 1, date[0]));
        });
      },
      error: () => {
        this.showErrorMessage('Error al recuperar las fechas');
      },
    });
  }

  showErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}

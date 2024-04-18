import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin, map, of } from 'rxjs';
import { Reserve } from 'src/interfaces/reserve';
import { IResponse } from 'src/interfaces/response';
import { ReservationService } from 'src/services/reservation.service';
import { RoomService } from 'src/services/room.service';
import { SeatService } from 'src/services/seat.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss',
})
export class ReservationListComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  reservations: Reserve[] = [];
  error: boolean = false;
  isLoading: boolean = false;
  email!: string;

  constructor(
    private router: Router,
    private reservationService: ReservationService,
    private roomService: RoomService,
    private seatService: SeatService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('user');
    if (email) this.email = email;
    this.getAllReservesByTeacherEmail();
  }

  getAllReservesByTeacherEmail() {
    this.isLoading = true;

    this.reservationService.getAllReservesByTeacherEmail(this.email).subscribe({
      next: (res: IResponse) => {
        const reservationArray = JSON.parse(res.response);

        const observablesArray = reservationArray.map((r: Reserve) => {
          return forkJoin({
            room: this.getRoomById(r.room_id),
            seat: this.getSeatById(r.seat_id),
          }).pipe(
            map((data: any) => ({
              ...r,
              room_id: data.room,
              seat_id: data.seat,
            }))
          );
        });

        forkJoin(observablesArray).subscribe({
          next: (res) => {
            this.reservations = res as Reserve[];
            this.isLoading = false;
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al recuperar las reservas',
            });

            this.error = true;
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar las reservas',
        });

        this.error = true;
        this.isLoading = false;
      },
    });
  }

  getRoomById(id: number) {
    return this.roomService
      .getRoomById(id)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0].name));
  }

  getSeatById(id: number | undefined) {
    if (id)
      return this.seatService
        .getSeatById(id)
        .pipe(map((res: IResponse) => JSON.parse(res.response)[0].name));
    else return of('Sala entera');
  }

  warningDelete(reserve: Reserve) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message:
        'Se eliminará la reserva del puesto: ' +
        reserve.seat_id +
        ', ' +
        reserve.room_id,
      header: 'Eliminar reserva',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.delete(reserve.id);
      },
      reject: () => {},
    });
  }

  delete(id: number) {
    this.isLoading = true;

    this.reservationService.deleteReserve(id).subscribe((res) => {
      if (res.code === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminada',
          detail: 'Reserva eliminada correctamente',
        });

        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la reserva',
        });

        this.isLoading = false;
      }
    });
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }

  clearFilter(table: Table) {
    table.clear();
  }
}

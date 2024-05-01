import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Reserve } from 'src/interfaces/reserve';
import { IResponse } from 'src/interfaces/response';
import { CenterService } from 'src/services/center.service';
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
  email!: string;
  isGlobalAdmin: boolean = false;
  center!: string;
  role!: string;
  showAllByCif!: boolean;

  constructor(
    private router: Router,
    private reservationService: ReservationService,
    private roomService: RoomService,
    private seatService: SeatService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private centerService: CenterService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('user');
    const center = localStorage.getItem('center');
    const role = localStorage.getItem('role');

    if (email) this.email = email;
    if (center) this.center = center;
    if (role) {
      if (role === '0') {
        this.isGlobalAdmin = true;
        this.getAllReserves();
      } else if (role === '1') {
        const path = this.activatedRoute.snapshot.routeConfig?.path;

        if (path && path === 'all-reserves') {
          this.showAllByCif = true;
          this.getAllReserves();
        } else this.getAllReservesByTeacherEmail();
      } else this.getAllReservesByTeacherEmail();
    }
  }

  getAllReserves() {
    this.reservationService.getAllReserves().subscribe({
      next: (res: IResponse) => {
        const reservationArray = JSON.parse(res.response);

        const observablesArray = reservationArray.map((r: Reserve) => {
          return forkJoin({
            room: this.getRoomById(r.room_id),
            seat: this.getSeatById(r.seat_id),
          }).pipe(
            switchMap((data: any) => {
              return this.getCenterByCif(data.room.center_cif).pipe(
                map((center: any) => ({
                  ...r,
                  room_id: data.room.name,
                  seat_id: data.seat,
                  center: center,
                }))
              );
            })
          );
        });

        forkJoin(observablesArray).subscribe({
          next: (res) => {
            if (this.showAllByCif) {
              this.reservations = (res as Reserve[]).filter(
                (reservation) => reservation.center?.cif === this.center
              );
            } else this.reservations = res as Reserve[];
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al recuperar las reservas',
            });

            this.error = true;
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
      },
    });
  }

  getAllReservesByTeacherEmail() {
    this.reservationService.getAllReservesByTeacherEmail(this.email).subscribe({
      next: (res: IResponse) => {
        const reservationArray = JSON.parse(res.response);
        console.log(reservationArray);

        const observablesArray = reservationArray.map((r: Reserve) => {
          return forkJoin({
            room: this.getRoomById(r.room_id),
            seat: this.getSeatById(r.seat_id),
          }).pipe(
            map((data: any) => ({
              ...r,
              room_id: data.room.name,
              seat_id: data.seat,
            }))
          );
        });

        forkJoin(observablesArray).subscribe({
          next: (res) => {
            this.reservations = res as Reserve[];
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al recuperar las reservas',
            });

            this.error = true;
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
      },
    });
  }

  getRoomById(id: number) {
    return this.roomService
      .getRoomById(id)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0]));
  }

  getSeatById(id: number | undefined) {
    if (id)
      return this.seatService
        .getSeatById(id)
        .pipe(map((res: IResponse) => JSON.parse(res.response)[0].name));
    else return of('Sala entera');
  }

  getCenterByCif(centerCif: string): Observable<any> {
    return this.centerService
      .getCenterByCif(centerCif)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0]));
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

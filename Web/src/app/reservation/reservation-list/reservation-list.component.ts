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
  reservationToDelete!: string | undefined;

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
              const date = r.date.split('/');

              const selectedDate = new Date(
                Number(date[2]),
                Number(date[1]) - 1,
                Number(date[0])
              );
              const selected =
                selectedDate.getDate() +
                '-' +
                selectedDate.getMonth() +
                '-' +
                selectedDate.getFullYear();

              const todayDate = new Date();
              const today =
                todayDate.getDate() +
                '-' +
                todayDate.getMonth() +
                '-' +
                todayDate.getFullYear();

              if (selected !== today)
                if (selectedDate < todayDate)
                  this.delete(
                    r.id,
                    data.room.reservation_type,
                    r.room_id,
                    r.date,
                    r.seat_id,
                    true
                  );

              return this.getCenterByCif(data.room.center_cif).pipe(
                map((center: any) => ({
                  ...r,
                  room_id: data.room.id,
                  room_name: data.room.name,
                  seat_id: data.seat,
                  center: center,
                  reservation_type: data.room.reservation_type,
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

        const observablesArray = reservationArray.map((r: Reserve) => {
          return forkJoin({
            room: this.getRoomById(r.room_id),
            seat: this.getSeatById(r.seat_id),
          }).pipe(
            map((data: any) => {
              const date = r.date.split('/');

              const selectedDate = new Date(
                Number(date[2]),
                Number(date[1]) - 1,
                Number(date[0])
              );
              const selected =
                selectedDate.getDate() +
                '-' +
                selectedDate.getMonth() +
                '-' +
                selectedDate.getFullYear();

              const todayDate = new Date();
              const today =
                todayDate.getDate() +
                '-' +
                todayDate.getMonth() +
                '-' +
                todayDate.getFullYear();

              if (selected !== today)
                if (selectedDate < todayDate)
                  this.delete(
                    r.id,
                    data.room.reservation_type,
                    r.room_id,
                    r.date,
                    r.seat_id,
                    true
                  );

              return {
                ...r,
                room_id: data.room.id,
                room_name: data.room.name,
                seat_id: data.seat,
                reservation_type: data.room.reservation_type,
              };
            })
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
    this.reservationToDelete = reserve.seat_id + ' - ' + reserve.room_name;
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      header: 'Eliminar reserva',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.delete(
          reserve.id,
          reserve.reservation_type,
          reserve.room_id,
          reserve.date,
          reserve.seat_id
        );
      },
      reject: () => {},
    });
  }

  delete(
    id: number,
    reservation_type: number | undefined,
    room_id: number,
    date: string,
    seat_id: any | undefined,
    update: boolean = false
  ) {
    const dateSplit = date.split('/');
    const newDate = new Date(
      Number(dateSplit[2]),
      Number(dateSplit[1]) - 1,
      Number(dateSplit[0])
    );
    const selected = this.formatDate(newDate);
    const today = this.formatDate(new Date());
    const updateState = selected === today ? true : false;

    if (reservation_type)
      if (
        reservation_type === 1 ||
        (reservation_type === 3 && seat_id === 'Sala entera')
      )
        updateState ? this.updateSeatStateByRoomId(room_id) : '';

    this.reservationService.deleteReserve(id, updateState).subscribe((res) => {
      if (res.code === 200) {
        this.messageService.add({
          severity: 'success',
          summary: update ? 'Actualizado' : 'Eliminada',
          detail: update
            ? 'Actualización completada'
            : 'Reserva eliminada correctamente',
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

  updateSeatStateByRoomId(room_id: number) {
    this.seatService.updateSeatStateByRoomId(room_id, 1).subscribe({
      next: () => {},
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al actualizar el estado',
        });
      },
    });
  }

  formatDate(date: Date) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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

  contains(selector: string, text: string) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
      return RegExp(text).test(element.textContent);
    });
  }

  filterOpen() {
    let element = this.contains('span', 'Clear')[0];
    if (element && element !== undefined) {
      element.textContent = 'Limpiar';
    }

    let element2 = this.contains('span', 'Apply')[0];
    if (element2 && element2 !== undefined) {
      element2.textContent = 'Aplicar';
    }
  }
}

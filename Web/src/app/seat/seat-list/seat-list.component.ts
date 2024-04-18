import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable, forkJoin, map, of } from 'rxjs';
import { IResponse } from 'src/interfaces/response';
import { Seat } from 'src/interfaces/seat';
import { RoomService } from 'src/services/room.service';
import { SeatService } from 'src/services/seat.service';

@Component({
  selector: 'app-seat-list',
  templateUrl: './seat-list.component.html',
  styleUrl: './seat-list.component.scss',
})
export class SeatListComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  seats: Seat[] = [];
  error: boolean = false;
  isLoading: boolean = false;
  center!: string;
  isAdmin: boolean = false;

  constructor(
    private seatService: SeatService,
    private roomService: RoomService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');

    this.getAllSeats();

    if (role && role === '1') this.isAdmin = true;
  }

  getAllSeats() {
    this.isLoading = true;

    this.seatService.getAllSeats().subscribe({
      next: (res: IResponse) => {
        const seatArray = JSON.parse(res.response);

        const observablesArray = seatArray.map((seat: Seat) => {
          return forkJoin({
            state: of(this.getState(seat.state)),
            room: this.getRoomById(seat.room_id),
          }).pipe(
            map((data) => ({
              ...seat,
              state: data.state,
              room_id: data.room.name,
            }))
          );
        });

        forkJoin(observablesArray).subscribe({
          next: (res) => {
            this.seats = res as Seat[];
            this.isLoading = false;
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al recuperar los datos',
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
          detail: 'Error al recuperar los puestos',
        });

        this.error = true;
        this.isLoading = false;
      },
    });
  }

  getState(state: number) {
    switch (state) {
      case 1:
        return 'Disponible';
      case 0:
        return 'Ocupado';
      default:
        console.log(state);
        return '';
    }
  }

  getRoomById(roomId: number): Observable<any> {
    return this.roomService
      .getRoomById(roomId)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0]));
  }

  create() {
    this.router.navigate(['seats/create-seat']);
  }

  reserve(id: number) {
    this.router.navigate(['reservation', id]);
  }

  edit(id: number) {
    this.router.navigate(['seats/edit-seat', id]);
  }

  warningDelete(seat: Seat) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: 'Se eliminará el puesto: ' + seat.name,
      header: 'Eliminar puesto',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.delete(seat.id);
      },
      reject: () => {},
    });
  }

  delete(id: number) {
    this.isLoading = true;

    this.seatService.deleteSeat(id).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminado',
            detail: 'Puesto eliminado correctamente',
          });

          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el puesto',
          });
          this.isLoading = false;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el puesto',
        });
      },
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

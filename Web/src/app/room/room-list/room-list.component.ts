import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable, forkJoin, map, of } from 'rxjs';
import { IResponse } from 'src/interfaces/response';
import { Room } from 'src/interfaces/room';
import { CenterService } from 'src/services/center.service';
import { RoomTypeService } from 'src/services/room-type.service';
import { RoomService } from 'src/services/room.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss',
})
export class RoomListComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  rooms: Room[] = [];
  error: boolean = false;
  isLoading: boolean = false;
  center!: string;
  isAdmin: boolean = false;
  role!: string | null;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private roomTypeService: RoomTypeService,
    private centerService: CenterService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const center = localStorage.getItem('center');
    this.role = localStorage.getItem('role');

    if (center) {
      this.center = center;
      this.getAllRoomsByCif();
    }

    if (this.role && this.role === '1') this.isAdmin = true;
  }

  getAllRoomsByCif() {
    this.isLoading = true;

    this.roomService.getAllRoomsByCif(this.center).subscribe({
      next: (res: IResponse) => {
        const roomArray = JSON.parse(res.response);

        const observablesArray = roomArray.map((room: Room) => {
          return forkJoin({
            reservation_type: of(
              this.getReserveTypeById(room.reservation_type)
            ),
            state: of(this.getState(room.state)),
            room_type: this.getRoomTypeById(room.room_type_id),
            center: this.getCenterByCif(room.center_cif),
          }).pipe(
            map((data) => ({
              ...room,
              reservation_type: data.reservation_type,
              state: data.state,
              room_type_id: data.room_type.name,
              center_cif: data.center.name,
            }))
          );
        });

        forkJoin(observablesArray).subscribe({
          next: (res: any) => {
            if (this.role === '1') this.rooms = res;
            else {
              res.map((room: Room) => {
                if (room.allowed_roles_ids.split(',').includes(this.role!)) {
                  this.rooms.push(room);
                }
              });
            }

            this.isLoading = false;
          },
          error: () => {
            this.error = true;
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar las salas',
        });

        this.error = true;
        this.isLoading = false;
      },
    });
  }

  getReserveTypeById(reserveTypeId: number) {
    let type = '';

    switch (reserveTypeId) {
      case 1:
        type = 'Sala entera';
        break;
      case 2:
        type = 'Puestos individuales';
        break;
      case 3:
        type = 'Entera / Individual';
        break;
      default:
        console.log(reserveTypeId);
        break;
    }

    return type;
  }

  getState(state: number) {
    switch (state) {
      case 1:
        return 'Disponible';
      case 0:
        return 'Ocupada';
      default:
        console.log(state);
        return '';
    }
  }

  getRoomTypeById(roomTypeId: number) {
    return this.roomTypeService
      .getRoomTypeById(roomTypeId)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0]));
  }

  getCenterByCif(centerCif: string): Observable<any> {
    return this.centerService
      .getCenterByCif(centerCif)
      .pipe(map((res: IResponse) => JSON.parse(res.response)[0]));
  }

  create() {
    this.router.navigate(['rooms/create-room']);
  }

  reserve(id: number) {
    this.router.navigate(['reservation', id]);
  }

  edit(id: number) {
    this.router.navigate(['rooms/edit-room', id]);
  }

  warningDelete(room: Room) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: 'Se eliminará la sala: ' + room.name,
      header: 'Eliminar sala',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.delete(room.id);
      },
      reject: () => {},
    });
  }

  delete(id: number) {
    this.isLoading = true;

    this.roomService.deleteRoom(id).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Eliminada',
            detail: 'Sala eliminada correctamente',
          });
          this.getAllRoomsByCif();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar la sala',
          });
          this.isLoading = false;
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar la sala',
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

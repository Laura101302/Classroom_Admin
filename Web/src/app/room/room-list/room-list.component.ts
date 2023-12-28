import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Observable, forkJoin, map } from 'rxjs';
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
  deleted: boolean = false;
  deletedError: boolean = false;
  isLoading: boolean = false;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private roomTypeService: RoomTypeService,
    private centerService: CenterService
  ) {}
  ngOnInit(): void {
    this.getAllRooms();
  }

  getAllRooms() {
    this.isLoading = true;

    this.roomService.getAllRooms().subscribe({
      next: (res: IResponse) => {
        const roomArray = JSON.parse(res.response);

        const observablesArray = roomArray.map((room: Room) => {
          return forkJoin({
            room_type: this.getRoomTypeById(room.room_type_id),
            center: this.getCenterByCif(room.center_cif),
          }).pipe(
            map((data) => ({
              ...room,
              room_type_id: data.room_type.name,
              center_cif: data.center.name,
            }))
          );
        });

        forkJoin(observablesArray).subscribe({
          next: (res) => {
            this.rooms = res as Room[];
            this.isLoading = false;
          },
          error: () => {
            this.error = true;
            this.isLoading = false;
          },
        });
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      },
    });
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

  edit(id: number) {
    this.router.navigate(['/rooms/edit-room', id]);
  }

  delete(id: number) {
    this.isLoading = true;

    this.roomService.deleteRoom(id).subscribe((res) => {
      if (res.code === 200) {
        this.deleted = true;
        this.deletedError = false;
        this.getAllRooms();
        setTimeout(() => {
          this.deleted = false;
        }, 3000);
      } else {
        this.deleted = false;
        this.deletedError = true;
        this.isLoading = false;
        setTimeout(() => {
          this.deletedError = false;
        }, 3000);
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
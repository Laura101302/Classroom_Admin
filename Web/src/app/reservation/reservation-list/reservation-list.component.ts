import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { forkJoin, map } from 'rxjs';
import { IResponse } from 'src/interfaces/response';
import { ReservationService } from 'src/services/reservation.service';
import { RoomService } from 'src/services/room.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.scss',
})
export class ReservationListComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  reservations: any[] = [];
  error: boolean = false;
  deleted: boolean = false;
  deletedError: boolean = false;
  isLoading: boolean = false;
  email!: string;

  constructor(
    private router: Router,
    private reservationService: ReservationService,
    private roomService: RoomService
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

        const observablesArray = reservationArray.map((r: any) => {
          return forkJoin({
            room: this.getRoomById(r.room_id),
          }).pipe(
            map((data: any) => ({
              ...r,
              room_id: data.room,
            }))
          );
        });

        forkJoin(observablesArray).subscribe({
          next: (res) => {
            this.reservations = res as any[];
            this.isLoading = false;
          },
          error: () => {
            this.error = true;
            this.isLoading = false;
          },
        });
      },
      error: (error) => {
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

  delete(id: number, idRoom: number) {
    this.isLoading = true;

    this.reservationService.deleteReserve(id).subscribe((res) => {
      if (res.code === 200) {
        this.deleted = true;
        this.deletedError = false;
        this.getAllReservesByTeacherEmail();
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

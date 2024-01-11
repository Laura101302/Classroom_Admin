import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  deleted: boolean = false;
  deletedError: boolean = false;
  isLoading: boolean = false;
  center!: string;
  isAdmin: boolean = false;

  constructor(
    private seatService: SeatService,
    private roomService: RoomService,
    private router: Router
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

  delete(id: number) {
    this.isLoading = true;

    this.seatService.deleteSeat(id).subscribe((res) => {
      if (res.code === 200) {
        this.deleted = true;
        this.deletedError = false;
        this.getAllSeats();
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

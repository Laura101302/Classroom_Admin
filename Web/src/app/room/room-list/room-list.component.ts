import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { RoomService } from 'src/services/room.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.scss',
})
export class RoomListComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  rooms: any[] = [];
  error: boolean = false;
  deleted: boolean = false;
  deletedError: boolean = false;
  isLoading: boolean = false;

  constructor(private roomService: RoomService, private router: Router) {}
  ngOnInit(): void {
    this.getAllRooms();
  }

  getAllRooms() {
    this.isLoading = true;

    this.roomService.getAllRooms().subscribe({
      next: (res: any) => {
        this.rooms = JSON.parse(res.response);
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      },
    });
  }

  create() {
    this.router.navigate(['rooms/create-rooms']);
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

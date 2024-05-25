import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { forkJoin, map, of } from 'rxjs';
import { Center } from 'src/interfaces/center';
import { IResponse } from 'src/interfaces/response';
import { Room } from 'src/interfaces/room';
import { Seat } from 'src/interfaces/seat';
import { CenterService } from 'src/services/center.service';
import { RoomService } from 'src/services/room.service';
import { SeatService } from 'src/services/seat.service';

@Component({
  selector: 'app-seat-form',
  templateUrl: './seat-form.component.html',
  styleUrl: './seat-form.component.scss',
})
export class SeatFormComponent implements OnInit {
  form!: FormGroup;
  isEditing: boolean = false;
  seat!: Seat;
  rooms!: Room[];
  selectedRoom!: Room | undefined;
  centers!: Center[];
  selectedCenter!: Center | undefined;
  center!: string;
  isGlobalAdmin: boolean = false;

  constructor(
    private seatService: SeatService,
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private centerService: CenterService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      state: [''],
      center_cif: [''],
      room_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    const center = localStorage.getItem('center');
    const role = localStorage.getItem('role');

    if (center) this.center = center;
    if (role && role === '0') {
      this.isGlobalAdmin = true;

      forkJoin({
        centers: this.getAllCenters(),
        rooms: this.getAllRooms(),
      }).subscribe({
        next: (res) => {
          if (params['id']) {
            this.rooms = res.rooms;
            this.setFormData(params['id']);
          } else this.centers = res.centers;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al recuperar los datos',
          });
        },
      });
    } else {
      forkJoin({
        rooms: this.getAllRoomsByCif(),
      }).subscribe({
        next: (res) => {
          this.form.get('center_cif')?.disable();
          this.rooms = res.rooms;
          if (params['id']) this.setFormData(params['id']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al recuperar los datos',
          });
        },
      });
    }
  }

  getAllCenters() {
    return this.centerService
      .getAllCenters()
      .pipe(map((res: IResponse) => JSON.parse(res.response)));
  }

  getAllRooms() {
    return this.roomService
      .getAllRooms()
      .pipe(map((res: IResponse) => JSON.parse(res.response)));
  }

  getAllRoomsByCif() {
    return this.roomService
      .getAllRoomsByCif(
        this.selectedCenter ? this.selectedCenter.cif : this.center
      )
      .pipe(map((res: IResponse) => JSON.parse(res.response)));
  }

  getRooms() {
    forkJoin({
      rooms: this.getAllRoomsByCif(),
    }).subscribe({
      next: (res) => {
        this.rooms = res.rooms;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los datos',
        });
      },
    });
  }

  setFormData(id: number) {
    this.isEditing = true;
    this.form.get('center_cif')?.disable();
    this.seatService.getSeatById(id).subscribe({
      next: (res: IResponse) => {
        this.seat = JSON.parse(res.response)[0];

        if (this.rooms)
          this.selectedRoom = this.rooms.find(
            (room) => room.id === this.seat.room_id
          );

        this.form = this.formBuilder.group({
          id: this.seat.id,
          name: this.seat.name,
          state: this.seat.state,
          room_id: this.seat.room_id,
        });

        this.form.get('room_id')?.disable();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar el puesto',
        });
      },
    });
  }

  createSeat() {
    this.form.get('center_cif')?.disable();
    const form = {
      ...this.form.value,
      state: 1,
      room_id: this.form.value.room_id.id,
    };

    const room = {
      ...this.form.value.room_id,
      allowed_roles_ids: this.form.value.room_id.allowed_roles_ids.split(','),
      seats_number: this.form.value.room_id.seats_number + 1,
    };

    const create = this.seatService.createSeat(form).subscribe({
      next: () => {},
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el puesto',
        });
      },
    });

    const edit = this.roomService.editRoom(room).subscribe({
      next: () => {},
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al editar la sala',
        });
      },
    });

    forkJoin({ createSeat: of(create), editRoom: of(edit) }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Creado',
          detail: 'Creado correctamente',
        });

        setTimeout(() => {
          this.router.navigate(['seats']);
        }, 2000);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear el puesto',
        });
      },
    });
  }

  editSeat() {
    this.form.get('room_id')?.enable();

    const form = {
      ...this.form.value,
      room_id: this.form.value.room_id.id,
    };

    this.form.get('room_id')?.disable();

    this.seatService.editSeat(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Editado',
            detail: 'Editado correctamente',
          });

          setTimeout(() => {
            this.router.navigate(['seats']);
          }, 2000);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al editar el puesto',
        });
      },
    });
  }
}

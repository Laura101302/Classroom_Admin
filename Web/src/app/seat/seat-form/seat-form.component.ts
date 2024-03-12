import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IResponse } from 'src/interfaces/response';
import { Room } from 'src/interfaces/room';
import { Seat } from 'src/interfaces/seat';
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

  constructor(
    private seatService: SeatService,
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      state: [''],
      room_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;

    this.getAllRooms();

    if (params['id']) {
      this.isEditing = true;
      this.seatService.getSeatById(params['id']).subscribe({
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
  }

  getAllRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (res) => (this.rooms = JSON.parse(res.response)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar las salas',
        });
      },
    });
  }

  createSeat() {
    const form = {
      ...this.form.value,
      state: 1,
      room_id: this.form.value.room_id.id,
    };

    this.seatService.createSeat(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Creado',
            detail: 'Creado correctamente',
          });
        }
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
    const form = {
      ...this.form.value,
      room_id: this.form.value.room_id.id,
    };

    this.seatService.editSeat(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Editado',
            detail: 'Editado correctamente',
          });
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

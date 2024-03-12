import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Center } from 'src/interfaces/center';
import { IResponse } from 'src/interfaces/response';
import { Room } from 'src/interfaces/room';
import { RoomType } from 'src/interfaces/room-type';
import { CenterService } from 'src/services/center.service';
import { RoomTypeService } from 'src/services/room-type.service';
import { RoomService } from 'src/services/room.service';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.scss',
})
export class RoomFormComponent implements OnInit {
  form!: FormGroup;
  isEditing: boolean = false;
  room!: Room;
  roomTypes!: RoomType[];
  selectedRoomType!: RoomType | undefined;
  reserveTypes = [
    {
      id: 1,
      name: 'Sala entera',
    },
    {
      id: 2,
      name: 'Puestos individuales',
    },
    {
      id: 3,
      name: 'Entera / Individual',
    },
  ];
  selectedReserveType!: any;
  state = [
    { id: 1, name: 'Disponible' },
    { id: 2, name: 'Ocupada' },
  ];
  centers!: Center[];
  selectedCenter!: Center | undefined;

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private roomTypeService: RoomTypeService,
    private centerService: CenterService,
    private messageService: MessageService
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      seats_number: ['', Validators.required],
      floor_number: ['', Validators.required],
      reservation_type: ['', Validators.required],
      room_type_id: ['', Validators.required],
      center_cif: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;

    this.getAllCenters();
    this.getAllRoomTypes();

    if (params['id']) {
      this.isEditing = true;
      this.roomService.getRoomById(params['id']).subscribe((res) => {
        this.room = JSON.parse(res.response)[0];

        if (this.reserveTypes)
          this.selectedReserveType = this.reserveTypes.find(
            (reserveType) => reserveType.id === this.room.reservation_type
          );

        if (this.roomTypes)
          this.selectedRoomType = this.roomTypes.find(
            (roomType) => roomType.id === this.room.room_type_id
          );

        if (this.centers)
          this.selectedCenter = this.centers.find(
            (center) => center.cif === this.room.center_cif
          );

        this.form = this.formBuilder.group({
          id: this.room.id,
          name: this.room.name,
          seats_number: this.room.seats_number,
          floor_number: this.room.floor_number,
          reservation_type: this.room.reservation_type,
          room_type_id: this.room.room_type_id,
          center_cif: this.room.center_cif,
        });
      });
    }
  }

  getAllCenters() {
    this.centerService.getAllCenters().subscribe({
      next: (res) => (this.centers = JSON.parse(res.response)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los centros',
        });
      },
    });
  }

  getAllRoomTypes() {
    this.roomTypeService.getAllRoomTypes().subscribe({
      next: (res) => (this.roomTypes = JSON.parse(res.response)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los tipos de salas',
        });
      },
    });
  }

  createRoom() {
    const form = {
      ...this.form.value,
      reservation_type: this.form.value.reservation_type.id,
      state: this.state[0].id,
      room_type_id: this.form.value.room_type_id.id,
      center_cif: this.form.value.center_cif.cif,
    };

    this.roomService.createRoom(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Creada',
            detail: 'Creada correctamente',
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al crear la sala',
        });
      },
    });
  }

  editRoom() {
    const form = {
      ...this.form.value,
      reservation_type: this.form.value.reservation_type.id,
      room_type_id: this.form.value.room_type_id.id,
      center_cif: this.form.value.center_cif.cif,
    };

    this.roomService.editRoom(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Editada',
            detail: 'Editada correctamente',
          });
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al editar la sala',
        });
      },
    });
  }
}

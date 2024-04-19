import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Center } from 'src/interfaces/center';
import { IResponse } from 'src/interfaces/response';
import { Role } from 'src/interfaces/role';
import { Room } from 'src/interfaces/room';
import { RoomType } from 'src/interfaces/room-type';
import { CenterService } from 'src/services/center.service';
import { RoleService } from 'src/services/role.service';
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
  roles!: Role[];
  selectedRoles!: Role[];
  center!: string;

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private roomTypeService: RoomTypeService,
    private centerService: CenterService,
    private roleService: RoleService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      seats_number: ['', Validators.required],
      floor_number: ['', Validators.required],
      reservation_type: ['', Validators.required],
      room_type_id: ['', Validators.required],
      allowed_roles_ids: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    const center = localStorage.getItem('center');

    if (center) {
      this.center = center;

      this.getAllRoomTypes();
      this.getAllRoles();
    }

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

        if (this.roles) {
          this.selectedRoles = [];

          this.room.allowed_roles_ids.split(',').map((allowedRoleId) => {
            this.roles.map((role) => {
              if (parseInt(allowedRoleId) === role.id)
                this.selectedRoles.push(role);
            });
          });
        }

        this.form = this.formBuilder.group({
          id: this.room.id,
          name: this.room.name,
          seats_number: this.room.seats_number,
          floor_number: this.room.floor_number,
          reservation_type: this.room.reservation_type,
          room_type_id: this.room.room_type_id,
          center_cif: this.room.center_cif,
          allowed_roles_ids: this.room.allowed_roles_ids,
        });
      });
    }
  }

  getAllRoomTypes() {
    this.roomTypeService.getAllRoomTypes().subscribe({
      next: (res: IResponse) => (this.roomTypes = JSON.parse(res.response)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los tipos de salas',
        });
      },
    });
  }

  getAllRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (res: IResponse) => (this.roles = JSON.parse(res.response)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al recuperar los roles',
        });
      },
    });
  }

  createRoom() {
    const roles_ids = this.form.value.allowed_roles_ids.map(
      (role: Role) => role.id
    );

    const form = {
      ...this.form.value,
      reservation_type: this.form.value.reservation_type.id,
      state: this.state[0].id,
      room_type_id: this.form.value.room_type_id.id,
      center_cif: this.center,
      allowed_roles_ids: roles_ids,
    };

    this.roomService.createRoom(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Creada',
            detail: 'Creada correctamente',
          });

          setTimeout(() => {
            this.router.navigate(['rooms']);
          }, 2000);
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
    const roles_ids = this.form.value.allowed_roles_ids.map(
      (role: Role) => role.id
    );

    const form = {
      ...this.form.value,
      reservation_type: this.form.value.reservation_type.id,
      state: this.room.state,
      room_type_id: this.form.value.room_type_id.id,
      center_cif: this.form.value.center_cif.cif,
      allowed_roles_ids: roles_ids,
    };

    this.roomService.editRoom(form).subscribe({
      next: (res: IResponse) => {
        if (res.code === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Editada',
            detail: 'Editada correctamente',
          });

          setTimeout(() => {
            this.router.navigate(['rooms']);
          }, 2000);
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherFormComponent } from './teacher/teacher-form/teacher-form.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { CenterListComponent } from './center/center-list/center-list.component';
import { CenterFormComponent } from './center/center-form/center-form.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { RoomListComponent } from './room/room-list/room-list.component';
import { RoomFormComponent } from './room/room-form/room-form.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { UpdatePassComponent } from './profile/update-pass/update-pass.component';
import { ReservationFormComponent } from './reservation/reservation-form/reservation-form.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { SeatListComponent } from './seat/seat-list/seat-list.component';
import { SeatFormComponent } from './seat/seat-form/seat-form.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'centers', component: CenterListComponent },
  { path: 'centers/create-center', component: CenterFormComponent },
  { path: 'centers/edit-center/:cif', component: CenterFormComponent },
  { path: 'roles', component: RoleListComponent },
  { path: 'roles/edit-role/:id', component: RoleFormComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'teachers/create-teacher', component: TeacherFormComponent },
  { path: 'teachers/edit-teacher/:dni', component: TeacherFormComponent },
  { path: 'all-rooms', component: RoomListComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'rooms/create-room', component: RoomFormComponent },
  { path: 'rooms/edit-room/:id', component: RoomFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'update-pass', component: UpdatePassComponent },
  { path: 'all-reserves', component: ReservationListComponent },
  { path: 'my-reserves', component: ReservationListComponent },
  { path: 'reservation/:id', component: ReservationFormComponent },
  { path: 'seats', component: SeatListComponent },
  { path: 'seats/create-seat', component: SeatFormComponent },
  { path: 'seats/edit-seat/:id', component: SeatFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

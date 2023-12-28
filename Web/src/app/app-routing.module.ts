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

const routes: Routes = [
  { path: '', component: TeacherListComponent },
  { path: 'centers', component: CenterListComponent },
  { path: 'centers/create-center', component: CenterFormComponent },
  { path: 'centers/edit-center/:cif', component: CenterFormComponent },
  { path: 'roles', component: RoleListComponent },
  { path: 'roles/edit-role/:id', component: RoleFormComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'teachers/create-teacher', component: TeacherFormComponent },
  { path: 'teachers/edit-teacher/:dni', component: TeacherFormComponent },
  { path: 'rooms', component: RoomListComponent },
  { path: 'rooms/create-room', component: RoomFormComponent },
  { path: 'rooms/edit-room/:id', component: RoomFormComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

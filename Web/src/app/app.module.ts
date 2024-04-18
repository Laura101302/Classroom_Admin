import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherFormComponent } from './teacher/teacher-form/teacher-form.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { CenterListComponent } from './center/center-list/center-list.component';
import { CenterFormComponent } from './center/center-form/center-form.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { MenuComponent } from './menu/menu.component';
import { RoomListComponent } from './room/room-list/room-list.component';
import { RoomFormComponent } from './room/room-form/room-form.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { UpdatePassComponent } from './profile/update-pass/update-pass.component';
import { ReservationFormComponent } from './reservation/reservation-form/reservation-form.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { SeatFormComponent } from './seat/seat-form/seat-form.component';
import { SeatListComponent } from './seat/seat-list/seat-list.component';
import { FooterComponent } from './layout/footer/footer.component';

import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [
    AppComponent,
    TeacherFormComponent,
    TeacherListComponent,
    CenterListComponent,
    CenterFormComponent,
    RoleFormComponent,
    RoleListComponent,
    MenuComponent,
    RoomListComponent,
    RoomFormComponent,
    LoginComponent,
    ProfileComponent,
    UpdatePassComponent,
    ReservationFormComponent,
    ReservationListComponent,
    SeatFormComponent,
    SeatListComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    SidebarModule,
    BrowserAnimationsModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    DropdownModule,
    ProgressSpinnerModule,
    TableModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    MultiSelectModule,
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}

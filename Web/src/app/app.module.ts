import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherFormComponent } from './teacher/teacher-form/teacher-form.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseFormComponent } from './course/course-form/course-form.component';
import { CourseListComponent } from './course/course-list/course-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { StudentListComponent } from './student/student-list/student-list.component';
import { StudentFormComponent } from './student/student-form/student-form.component';
import { CenterListComponent } from './center/center-list/center-list.component';
import { CenterFormComponent } from './center/center-form/center-form.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { RoleListComponent } from './role/role-list/role-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TeacherFormComponent,
    CourseFormComponent,
    CourseListComponent,
    NavbarComponent,
    TeacherListComponent,
    StudentListComponent,
    StudentFormComponent,
    CenterListComponent,
    CenterFormComponent,
    RoleFormComponent,
    RoleListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherFormComponent } from './teacher/teacher-form/teacher-form.component';
import { CourseFormComponent } from './course/course-form/course-form.component';
import { CourseListComponent } from './course/course-list/course-list.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { StudentListComponent } from './student/student-list/student-list.component';
import { StudentFormComponent } from './student/student-form/student-form.component';
import { CenterListComponent } from './center/center-list/center-list.component';
import { CenterFormComponent } from './center/center-form/center-form.component';
import { RoleFormComponent } from './role/role-form/role-form.component';

const routes: Routes = [
  { path: '', component: TeacherListComponent },
  { path: 'centers', component: CenterListComponent },
  { path: 'centers/create-center', component: CenterFormComponent },
  { path: 'centers/edit-center/:cif', component: CenterFormComponent },
  { path: 'roles', component: RoleFormComponent },
  { path: 'roles/create-role', component: RoleFormComponent },
  { path: 'roles/edit-role/:id', component: RoleFormComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'teachers/create-teacher', component: TeacherFormComponent },
  { path: 'teachers/edit-teacher/:dni', component: TeacherFormComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'students/create-student', component: StudentFormComponent },
  { path: 'students/edit-student/:dni', component: StudentFormComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/create-course', component: CourseFormComponent },
  { path: 'courses/edit-course/:code', component: CourseFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

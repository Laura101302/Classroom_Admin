import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherSignUpComponent } from './sign-up/teacher-sign-up/teacher-sign-up.component';
import { CourseFormComponent } from './course/course-form/course-form.component';
import { CourseListComponent } from './course/course-list/course-list.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { StudentListComponent } from './student/student-list/student-list.component';

const routes: Routes = [
  { path: '', component: TeacherSignUpComponent },
  { path: 'teachers', component: TeacherListComponent },
  { path: 'teachers/create-teacher', component: TeacherSignUpComponent },
  { path: 'teachers/edit-teacher/:code', component: TeacherSignUpComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/create-course', component: CourseFormComponent },
  { path: 'courses/edit-course/:code', component: CourseFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

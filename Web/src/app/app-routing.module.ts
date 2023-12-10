import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherFormComponent } from './teacher/teacher-form/teacher-form.component';
import { CourseFormComponent } from './course/course-form/course-form.component';
import { CourseListComponent } from './course/course-list/course-list.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { StudentListComponent } from './student/student-list/student-list.component';
import { StudentFormComponent } from './student/student-form/student-form.component';

const routes: Routes = [
  { path: '', component: TeacherListComponent },
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

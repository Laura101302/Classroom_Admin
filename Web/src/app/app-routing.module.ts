import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherSignUpComponent } from './sign-up/teacher-sign-up/teacher-sign-up.component';

const routes: Routes = [
  { path: '', component: TeacherSignUpComponent },
  { path: 'teacher-sign-up', component: TeacherSignUpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

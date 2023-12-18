import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CenterService } from 'src/services/center.service';
import { CourseService } from 'src/services/course.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  form!: FormGroup;
  created: boolean = false;
  error: boolean = false;
  errorMessage!: string;
  isEditing: boolean = false;
  centers!: any;

  constructor(
    private courseService: CourseService,
    private formBuilder: FormBuilder,
    private centerService: CenterService
  ) {
    this.form = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      center_cif: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllCenters();
  }

  createCourse() {
    this.courseService.createCourse(this.form.value).subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          this.created = true;
          this.error = false;
        }
      },
      error: (error: any) => {
        this.created = false;
        this.error = true;
        this.errorMessage = error.error.message;
      },
    });
  }

  getAllCenters() {
    this.centerService.getAllCenters().subscribe((res) => {
      this.centers = JSON.parse(res.response);
    });
  }
}

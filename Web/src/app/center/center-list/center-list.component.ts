import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CenterService } from 'src/services/center.service';

@Component({
  selector: 'app-center-list',
  templateUrl: './center-list.component.html',
  styleUrls: ['./center-list.component.scss'],
})
export class CenterListComponent implements OnInit {
  centers: any[] = [];
  error: boolean = false;

  constructor(private centerService: CenterService, private router: Router) {}

  ngOnInit(): void {
    this.centerService.getAllCenters().subscribe({
      next: (res: any) => (this.centers = JSON.parse(res.response)),
      error: () => (this.error = true),
    });
  }

  create() {
    this.router.navigate(['centers/create-center']);
  }

  edit(cif: string) {
    this.router.navigate(['/centers/edit-center', cif]);
  }
}

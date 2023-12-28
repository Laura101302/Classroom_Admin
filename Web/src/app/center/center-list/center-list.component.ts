import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Center } from 'src/interfaces/center';
import { IResponse } from 'src/interfaces/response';
import { CenterService } from 'src/services/center.service';

@Component({
  selector: 'app-center-list',
  templateUrl: './center-list.component.html',
  styleUrls: ['./center-list.component.scss'],
})
export class CenterListComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  centers: Center[] = [];
  error: boolean = false;
  deleted: boolean = false;
  deletedError: boolean = false;
  isLoading: boolean = false;

  constructor(private centerService: CenterService, private router: Router) {}

  ngOnInit(): void {
    this.getAllCenters();
  }

  getAllCenters() {
    this.isLoading = true;

    this.centerService.getAllCenters().subscribe({
      next: (res: IResponse) => {
        this.centers = JSON.parse(res.response);
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      },
    });
  }

  create() {
    this.router.navigate(['centers/create-center']);
  }

  edit(cif: string) {
    this.router.navigate(['/centers/edit-center', cif]);
  }

  delete(cif: string) {
    this.isLoading = true;

    this.centerService.deleteCenter(cif).subscribe((res: any) => {
      if (res.code === 200) {
        this.deleted = true;
        this.deletedError = false;
        this.getAllCenters();
        setTimeout(() => {
          this.deleted = false;
        }, 3000);
      } else {
        this.deleted = false;
        this.deletedError = true;
        this.isLoading = false;
        setTimeout(() => {
          this.deletedError = false;
        }, 3000);
      }
    });
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.dt1!.filterGlobal(
      ($event.target as HTMLInputElement).value,
      stringVal
    );
  }

  clearFilter(table: Table) {
    table.clear();
  }
}

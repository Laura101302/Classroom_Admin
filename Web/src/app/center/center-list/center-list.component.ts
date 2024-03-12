import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  isLoading: boolean = false;

  constructor(
    private centerService: CenterService,
    private router: Router,
    private messageService: MessageService
  ) {}

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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error',
        });
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
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Centro eliminado correctamente',
        });
        this.getAllCenters();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se ha podido eliminar el centro',
        });
        this.isLoading = false;
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

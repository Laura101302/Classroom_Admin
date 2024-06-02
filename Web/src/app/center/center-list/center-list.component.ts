import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  centerToDelete!: string;

  constructor(
    private centerService: CenterService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllCenters();
  }

  getAllCenters() {
    this.centerService.getAllCenters().subscribe({
      next: (res: IResponse) => {
        this.centers = JSON.parse(res.response);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ha ocurrido un error',
        });
        this.error = true;
      },
    });
  }

  create() {
    this.router.navigate(['centers/create-center']);
  }

  edit(cif: string) {
    this.router.navigate(['/centers/edit-center', cif]);
  }

  warningDelete(center: Center) {
    this.centerToDelete = center.name;
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      header: 'Eliminar centro',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.delete(center.cif);
      },
      reject: () => {},
    });
  }

  delete(cif: string) {
    this.centerService.deleteCenter(cif).subscribe((res: any) => {
      if (res.code === 200) {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Centro eliminado correctamente',
        });

        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se ha podido eliminar el centro',
        });
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

  contains(selector: string, text: string) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
      return RegExp(text).test(element.textContent);
    });
  }

  filterOpen() {
    let element = this.contains('span', 'Clear')[0];
    if (element && element !== undefined) {
      element.textContent = 'Limpiar';
    }

    let element2 = this.contains('span', 'Apply')[0];
    if (element2 && element2 !== undefined) {
      element2.textContent = 'Aplicar';
    }
  }
}

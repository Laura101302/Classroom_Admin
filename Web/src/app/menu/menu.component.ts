import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  screenSize: number = window.innerWidth;
  isMobile!: boolean;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenSize = window.innerWidth;
    this.menuType();
  }

  ngOnInit(): void {
    this.menuType();

    this.menuItems = [
      {
        label: 'Centros',
        items: [
          {
            label: 'Lista de centros',
            icon: 'pi pi-fw pi-building',
            routerLink: ['centers'],
          },
          {
            label: 'Nuevo centro',
            icon: 'pi pi-fw pi-building',
            routerLink: ['centers/create-center'],
          },
        ],
      },
      {
        label: 'Profesores',
        items: [
          {
            label: 'Lista de profesores',
            icon: 'pi pi-fw pi-user',
            routerLink: ['teachers'],
          },
          {
            label: 'Nuevo profesor',
            icon: 'pi pi-fw pi-user',
            routerLink: ['teachers/create-teacher'],
          },
        ],
      },
      {
        label: 'Roles',
        items: [
          {
            label: 'Lista de roles',
            icon: 'pi pi-fw pi-user',
            routerLink: ['roles'],
          },
        ],
      },
    ];
  }

  menuType() {
    if (this.screenSize <= 1024) this.isMobile = true;
    else this.isMobile = false;
  }
}

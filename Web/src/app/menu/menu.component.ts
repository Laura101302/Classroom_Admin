import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { IResponse } from 'src/interfaces/response';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  screenSize: number = window.innerWidth;
  isMobile!: boolean;
  isLogged: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenSize = window.innerWidth;
    this.menuType();
  }

  ngOnInit(): void {
    this.isAuthenticated();
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
      {
        label: 'Salas',
        items: [
          {
            label: 'Lista de salas',
            icon: 'pi pi-fw pi-building',
            routerLink: ['rooms'],
          },
          {
            label: 'Nueva sala',
            icon: 'pi pi-fw pi-building',
            routerLink: ['rooms/create-room'],
          },
        ],
      },

      {
        label: 'Reservas',
        items: [
          {
            label: 'Mis reservas',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['my-reserves'],
          },
          {
            label: 'Reservar',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['rooms'],
          },
        ],
      },
    ];
  }

  isAuthenticated() {
    if (this.authService.isAuthenticated()) this.isLogged = true;
    else this.isLogged = false;
  }

  menuType() {
    if (this.screenSize <= 1024) this.isMobile = true;
    else this.isMobile = false;
  }
}

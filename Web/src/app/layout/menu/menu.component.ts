import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  globalAdminMenuItems: MenuItem[] = [];
  adminMenuItems: MenuItem[] = [];
  menuItems: MenuItem[] = [];
  screenSize: number = window.innerWidth;
  isMobile!: boolean;
  isLogged: boolean = false;
  isGlobalAdmin: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenSize = window.innerWidth;
    this.menuType();
  }

  ngOnInit(): void {
    this.isAuthenticated();
    this.roleType();
    this.menuType();

    this.globalAdminMenuItems = [
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
            icon: 'pi pi-fw pi-plus',
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
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['teachers/create-teacher'],
          },
        ],
      },
      {
        label: 'Roles',
        items: [
          {
            label: 'Lista de roles',
            icon: 'pi pi-fw pi-list',
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
            icon: 'pi pi-fw pi-plus',
            routerLink: ['rooms/create-room'],
          },
        ],
      },

      {
        label: 'Puestos',
        items: [
          {
            label: 'Lista de puestos',
            icon: 'pi pi-fw pi-building',
            routerLink: ['seats'],
          },
          {
            label: 'Nuevo puesto',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['seats/create-seat'],
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
            icon: 'pi pi-fw pi-plus',
            routerLink: ['rooms'],
          },
        ],
      },
    ];

    this.adminMenuItems = [
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
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['teachers/create-teacher'],
          },
        ],
      },
      {
        label: 'Roles',
        items: [
          {
            label: 'Lista de roles',
            icon: 'pi pi-fw pi-list',
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
            icon: 'pi pi-fw pi-plus',
            routerLink: ['rooms/create-room'],
          },
        ],
      },

      {
        label: 'Puestos',
        items: [
          {
            label: 'Lista de puestos',
            icon: 'pi pi-fw pi-building',
            routerLink: ['seats'],
          },
          {
            label: 'Nuevo puesto',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['seats/create-seat'],
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
            icon: 'pi pi-fw pi-plus',
            routerLink: ['rooms'],
          },
        ],
      },
    ];

    this.menuItems = [
      {
        label: 'Salas',
        items: [
          {
            label: 'Lista de salas',
            icon: 'pi pi-fw pi-building',
            routerLink: ['rooms'],
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
            icon: 'pi pi-fw pi-plus',
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

  roleType() {
    const role = localStorage.getItem('role');

    if (role && role === '0') this.isGlobalAdmin = true;
    else if (role && role === '1') this.isAdmin = true;
    else this.isAdmin = false;
  }

  menuType() {
    if (this.screenSize <= 1024) this.isMobile = true;
    else this.isMobile = false;
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('center');
    localStorage.removeItem('role');

    window.location.reload();
  }
}

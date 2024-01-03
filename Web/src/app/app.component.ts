import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Classroom_Admin';
  isLogged: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAuthenticated();
  }

  isAuthenticated() {
    if (this.authService.isAuthenticated()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
      this.router.navigate(['/login']);
    }
  }
}

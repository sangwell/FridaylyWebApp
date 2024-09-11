import { Component } from '@angular/core';
import {AuthService} from './service/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    private router:Router,
    public authService:AuthService
  ){}

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}

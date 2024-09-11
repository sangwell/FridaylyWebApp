import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class ErrorHandleService{

  constructor(
    private router: Router,
    public authService:AuthService
  ){}

  errorHandle(error){
      let errorStatus=error.status;
      if(errorStatus===401){
        this.authService.logout();
        this.router.navigate(['/login']);
      }
  }
}

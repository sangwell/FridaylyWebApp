import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
  private isToken=window.localStorage.getItem('token');
  isLoggedIn = this.isToken?true:false;

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  // login(): Observable<boolean> {
  //   return Observable.of(true).delay(1000).do(val => this.isLoggedIn = true);
  // }

  login(){
    this.isLoggedIn = true;
  }
  logout(): void {
    this.isLoggedIn = false;
    window.localStorage.clear();
  }
}

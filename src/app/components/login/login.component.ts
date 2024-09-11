import {Component} from "@angular/core";
import { Router }      from '@angular/router';
import { AuthService } from '../../service/auth.service';
import {UserModel} from '../register/user.model';
import {ApiService} from '../../service/api.service';

@Component({
  templateUrl:'login.template.html',
  styleUrls:['login.style.css']
})

export class LoginComponent{

  userModel:UserModel=new UserModel();

  constructor(
    public authService: AuthService,
    public router: Router,
    private apiService:ApiService) {}

  login(){
    this.apiService.Login(this.userModel).subscribe(
      data=>{
        if(data.success){
          this.authService.login();
          window.localStorage.setItem('token',data.token);
          this.router.navigate(['home']);
          if (data.isInitFunds===0){
            // alert(123);
            //
            //
          }
        }else{
          console.log(data.message);
        }
      },
      error=>{
        console.log(error);
      }
    );
  }

  // login() {
  //   this.message = 'Trying to log in ...';
  //
  //   this.authService.login().subscribe(() => {
  //     this.setMessage();
  //     if (this.authService.isLoggedIn) {
  //       // Get the redirect URL from our auth service
  //       // If no redirect has been set, use the default
  //       let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/crisis-center/admin';
  //
  //       // Redirect the user
  //       this.router.navigate([redirect]);
  //     }
  //   });
  // }



}

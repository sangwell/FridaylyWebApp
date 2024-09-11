import {Component} from "@angular/core";
import {UserModel} from './user.model';
import {Router} from "@angular/router";
import {ApiService} from '../../service/api.service';

@Component({
  templateUrl:'register.template.html',
  styleUrls:['register.style.css']
})

export class RegisterComponent{

  userModel:UserModel=new UserModel();
  confirmedPassword:string='';
  passwordNotSame:boolean=false;

  constructor(
    private router:Router,
    private apiService:ApiService
  ){}

  register(){
      if(!this.checkRegister()){
        this.passwordNotSame=true;
        return false;
      }else{
        this.passwordNotSame=false;
      }
    this.apiService.Register(this.userModel).subscribe(
      data=>{
        if(data.success){
          this.router.navigate(['login']);
        }else{
          console.log(data.message);
        }
      },
      error=>{
        console.log(error);
      }
    );
  }

  checkRegister(){
    return this.userModel.Password === this.confirmedPassword;
  }

}

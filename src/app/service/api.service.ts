import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions }       from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import {CanActivate,Router,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService{

  /*
  api base url
   */
  private baseUrl:string='http://localhost:8081/';
  // private baseUrl:string='http://116.62.153.16:8899/';
  // public baseUrl:string='http://backend.fridayly.com/';
  /*
  api url
   */
  private LoginUrl=this.baseUrl+'Login';
  private GetAllFundsUrl=this.baseUrl+'GetAllFunds';
  private GetMyFundsUrl=this.baseUrl+'GetMyFunds';
  private AddMyFundsUrl=this.baseUrl+'AddMyFunds';
  private UpdateMyFundsUrl=this.baseUrl+'UpdateMyFunds';
  private DeleteMyFundsUrl=this.baseUrl+'DeleteMyFunds';
  private GetFundDataUrl=this.baseUrl+'GetFundData';
  private SearchFundUrl=this.baseUrl+'SearchFund';
  private RegisterUrl=this.baseUrl+'Register';
  private GetSHStockIndexUrl=this.baseUrl+'GetSHStockIndex';
  //
  private ApiWithTokenUrl=this.baseUrl+'ApiWithToken';


  constructor(private http:Http){}



  Login(model):Observable<any>{
    return this.http.post(this.LoginUrl,model).map(response => response.json());
  }
  GetAllFunds(): Observable<any> {
    return this.http.get(this.GetAllFundsUrl,this.headerWithToken()).map(response => response.json());
  }
  GetMyFunds(): Observable<any> {
    return this.http.get(this.GetMyFundsUrl,this.headerWithToken()).map(response => response.json());
  }
  AddMyFunds(model): Observable<any> {
    return this.http.post(this.AddMyFundsUrl,model,this.headerWithToken()).map(response => response);
  }
  UpdateMyFunds(model): Observable<any> {
    return this.http.post(this.UpdateMyFundsUrl,model,this.headerWithToken()).map(response => response);
  }
  DeleteMyFunds(model): Observable<any> {
    return this.http.post(this.DeleteMyFundsUrl,model,this.headerWithToken()).map(response => response);
  }
  GetFundData(queryModel):Observable<any>{
    return this.http.post(this.GetFundDataUrl,queryModel,this.headerWithToken()).map(response => response);
  }
  SearchFund(queryModel):Observable<any>{
    return this.http.post(this.SearchFundUrl,queryModel,this.headerWithToken()).map(response => response);
  }
  GetSHStockIndex(queryModel):Observable<any>{
    return this.http.post(this.GetSHStockIndexUrl,queryModel,this.headerWithToken()).map(response => response.json());
  }
  Register(userModel):Observable<any>{
    return this.http.post(this.RegisterUrl,userModel).map(response => response.json());
  }
  //
  headerWithToken(){
    let token=window.localStorage.getItem('token');
    if (token) {
      let headers = new Headers();
      headers.append('Authorization',token);
      // headers.append( 'Content-Type','application/json');
      return new RequestOptions({ headers: headers });
    }
  }
  ApiWithToken():Observable<any>{
    return this.http.get(this.ApiWithTokenUrl,this.headerWithToken()).map(response => response.json());
  }

}



@Injectable()
export  class OnlyLoggedInUsersGuard implements CanActivate {
  constructor(
    private router:Router
  ) {}

  canActivate() {
    if (localStorage.getItem("token")) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const Role={
  IsLoggedIn:OnlyLoggedInUsersGuard
};

// export let ShowMenu=false;


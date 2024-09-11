import {Component,OnInit} from "@angular/core";
import {AuthService} from '../../service/auth.service';
import {AddFundComponent} from './add-fund/add-fund.component';
import {UpdateFundComponent} from './update-fund/update-fund.component';
import {DeleteFundComponent} from './delete-fund/delete-fund.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ApiService} from '../../service/api.service';
import {ErrorHandleService} from '../../service/error-handle.service';
import {FundSearchModel} from './fund-search.model';

@Component({
  templateUrl:'fund-manage.template.html',
  styleUrls:['fund-manage.style.css']
})

export class FundManageComponent implements OnInit{

  myFundList=[];
  fundSearchModel:FundSearchModel=new FundSearchModel();
  showSearchResult:boolean=false;
  searchResults=[];

  constructor(
    public authService:AuthService,
    public dialog: MatDialog,
    private apiService:ApiService,
    private errorHandleService:ErrorHandleService
  ){}

  ngOnInit(){
      if(this.authService.isLoggedIn){
        this.getMyFunds();
      }
  }

  getMyFunds(){
    this.apiService.GetMyFunds().subscribe(
      data=>{
        this.myFundList=data;
      },
      error=>{
        this.errorHandleService.errorHandle(error);
      }
    );
  }

  searchFund(){
    if(this.fundSearchModel.FundCode===''){
      this.showSearchResult=true;
      return false;
    }
    this.apiService.SearchFund(this.fundSearchModel).subscribe(
      data=>{
        let obj:any=JSON.parse(data._body);
        let result=obj.Datas;
        let fundArray=[];
        result.forEach((item)=>{
          let temp:any={};
          temp.FundCode=item.CODE;
          temp.FundName=item.NAME;
          fundArray.push(temp);
        });
        this.showSearchResult=true;
        this.searchResults=fundArray;
        console.log(fundArray);
      },
      error=>{
        console.log(error);
      }
    );
  }
  closeSearchResult(){
    this.showSearchResult=false;
  }
  addFund(fund){
    console.log(fund);
    this.apiService.AddMyFunds(fund).subscribe(
      data=>{
        this.showSearchResult=false;
        this.getMyFunds();
      },
      error=>{
        console.log(error);
      }
    );
  }
  /*searchFund(){
    let queryBody={
      FundNo:'11002'
    };
    this.apiService.SearchFund(queryBody).subscribe(
      data=>{
        let obj:any=JSON.parse(data._body);
        let result=obj.Datas;
        let fundArray=[];
        result.forEach((item)=>{
          let temp:any={};
          temp.FundCode=item.CODE;
          temp.FundName=item.NAME;
          fundArray.push(temp);
        });
        console.log(fundArray);
      },
      error=>{
        console.log(error);
      }
    );
  }*/

  openAddModal(){
    let dialogRef = this.dialog.open(AddFundComponent, {
      width: '500px',
      height:'275px',
      disableClose:true,
      panelClass:'dialog-layout',
      autoFocus:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getMyFunds();
      }
    });
  }

  openUpdateModal(selectedFund){
    let dialogRef = this.dialog.open(UpdateFundComponent, {
      width: '500px',
      height:'275px',
      disableClose:true,
      panelClass:'dialog-layout',
      autoFocus:true,
      data: selectedFund
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getMyFunds();
      }
    });
  }

  openDeleteModal(selectedFund){
    let dialogRef = this.dialog.open(DeleteFundComponent, {
      width: '500px',
      height:'185px',
      disableClose:true,
      panelClass:'dialog-layout',
      autoFocus:true,
      data: selectedFund
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getMyFunds();
      }
    });
  }


}

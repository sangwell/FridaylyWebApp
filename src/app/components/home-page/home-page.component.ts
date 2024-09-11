import {Component,OnInit,AfterViewInit} from "@angular/core";
import {AuthService} from '../../service/auth.service';
import {ApiService} from '../../service/api.service';
import {CommonService} from '../../service/common.service';
import {ErrorHandleService} from '../../service/error-handle.service';
import {FundRecommendComponent} from './fund-recommend/fund-recommend.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FundDataQueryModel} from './fund-data-query.model';
declare let require:any;

@Component({
  templateUrl:'home-page.template.html',
  styleUrls:['home-page.style.css']
})

export class HomePageComponent implements OnInit,AfterViewInit{

  moment=require('moment');
  popularFundsFirst=[
    {Name:'光大中国制造2025混合',Rate:'71.08'},
    {Name:'广发全球精选股票',Rate:'30.77'}
  ];
  popularFundsSecond=[
    {Name:'工银香港中小盘股票',Rate:'34.77'},
    {Name:'汇添富消费行业混合',Rate:'62.72'}
  ];
  funds=[];
  selectedTime:string;
  riseDays:number=0;
  fallDays:number=0;

  fundName:string;
  fundCode:string;
  fundDataQueryModel:FundDataQueryModel=new FundDataQueryModel();
  timeSelection=[
    {Id:0,Name:'1月',isSelected:true},
    {Id:1,Name:'3月',isSelected:false},
    {Id:2,Name:'6月',isSelected:false},
    {Id:3,Name:'1年',isSelected:false},
    {Id:4,Name:'3年',isSelected:false},
    {Id:5,Name:'5年',isSelected:false},
    {Id:6,Name:'今年来',isSelected:false}
  ];
  chartData:any=[];
  isNoFund:boolean=false;
  isQueryPanelLoading:boolean=false;
  isBlankResult:boolean=true;

  constructor(
    public authService:AuthService,
    public dialog: MatDialog,
    private apiService:ApiService,
    private errorHandleService:ErrorHandleService,
    private commonService:CommonService
  ){}

  ngOnInit(){
      if(this.authService.isLoggedIn){
        this.selectTime(0,this.timeSelection[0].Name);
        this.fundDataQueryModel.EndDate=this.moment().format('YYYY-MM-DD');
        this.getFunds();
      }
  }

  ngAfterViewInit(){
    // setTimeout(()=>{
    //   this.openDialog();
    // },0);
  }

  getFunds(){
    this.apiService.GetMyFunds().subscribe(
      data=>{
        if(data.length===0){
          this.isNoFund=true;
          return false;
        }
        this.isBlankResult=false;
        this.funds=data;
        this.fundDataQueryModel.FundNo=this.funds[0].FundCode;
        this.fundName=this.funds[0].FundName;
        this.fundCode=this.funds[0].FundCode;
        this.getFundData();
      },
      error=>{
        this.errorHandleService.errorHandle(error);
      }
    );
  }

  getFundData(){
    [this.riseDays,this.fallDays]=[0,0];
    this.isQueryPanelLoading=true;
    this.apiService.GetFundData(this.fundDataQueryModel).subscribe(
      data=>{
        let dataArray=this.commonService.parserDomToChartData(data);
        this.chartData=dataArray;
        dataArray.forEach((item)=>{
          if(item.rate>=0){
            this.riseDays++;
          }else{
            this.fallDays++;
          }
        });
        this.isQueryPanelLoading=false;
      },
      error=>{
        console.log(error);
      }
    );
  }

  selectFund(fundCode,fundName){
    this.fundName=fundName;
    this.fundCode=fundCode;
    this.fundDataQueryModel.FundNo=fundCode;
    this.getFundData();
  }

  selectTime(id,name){
    this.selectedTime=name;
    this.clearActiveStyle();
    this.timeSelection[id].isSelected=true;

    switch (id)
    {
      case 0:
        let oneMonth=this.moment().add(-1, 'months').format('YYYY-MM-DD');
        this.fundDataQueryModel.StartDate=oneMonth;
        break;
      case 1:
        let threeMonth=this.moment().add(-3, 'months').format('YYYY-MM-DD');
        this.fundDataQueryModel.StartDate=threeMonth;
        break;
      case 2:
        let halfYear=this.moment().add(-6, 'months').format('YYYY-MM-DD');
        this.fundDataQueryModel.StartDate=halfYear;
        break;
      case 3:
        let oneYear=this.moment().add(-12, 'months').format('YYYY-MM-DD');
        this.fundDataQueryModel.StartDate=oneYear;
        break;
      case 4:
        let threeYear=this.moment().add(-3, 'years').format('YYYY-MM-DD');
        this.fundDataQueryModel.StartDate=threeYear;
        break;
      case 5:
        let fiveYear=this.moment().add(-5, 'years').format('YYYY-MM-DD');
        this.fundDataQueryModel.StartDate=fiveYear;
        break;
      case 6:
        let thisYear=this.moment().get('year');
        this.fundDataQueryModel.StartDate=thisYear+'-01-01';
        break;
      default:
        break;
    }
    if(this.funds.length>0){
      this.getFundData();
    }
  }
  clearActiveStyle(){
    this.timeSelection.forEach((item)=>{
      item.isSelected=false;
    });
  }
  openDialog(){
    let dialogRef = this.dialog.open(FundRecommendComponent, {
      width: '700px',
      height:'400px',
      disableClose:true,
      panelClass:'dialog-layout',
      autoFocus:true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  apiWithToken(){
    this.apiService.ApiWithToken().subscribe(
      data=>{
        console.log('OK');
        console.log(data);
      },
      error=>{
        this.errorHandleService.errorHandle(error);
      }
    );
  }


}

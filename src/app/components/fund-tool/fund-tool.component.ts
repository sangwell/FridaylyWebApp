import {Component,OnInit} from "@angular/core";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {ApiService} from '../../service/api.service';
import {StockQueryModel} from './stock-query.model';
import {FundToolSingleModel} from './fund-tool-single.model';
declare let require:any;

@Component({
  templateUrl:'fund-tool.template.html',
  styleUrls:['fund-tool.style.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'zh-cn'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})

export class FundToolComponent implements OnInit{

  fundToolSingleModel:FundToolSingleModel=new FundToolSingleModel;
  moment:any=require('moment');
  chartData:any=[];
  stockQueryModel:StockQueryModel=new StockQueryModel();
  timeSelection=[
    {Id:0,Name:'1月',isSelected:true},
    {Id:1,Name:'3月',isSelected:false},
    {Id:2,Name:'6月',isSelected:false},
    {Id:3,Name:'1年',isSelected:false},
    {Id:4,Name:'3年',isSelected:false},
    {Id:5,Name:'5年',isSelected:false},
    {Id:6,Name:'今年来',isSelected:false}
  ];
  isQueryPanelLoading:boolean=false;

  constructor(
    private apiService:ApiService
  ){}

  ngOnInit(){
    this.stockQueryModel.EndDate=this.moment().format('YYYY-MM-DD');
      this.selectTime(1);
  }

  setStartDate(event: MatDatepickerInputEvent<Date>) {
    this.stockQueryModel.StartDate=this.moment(event.value).format('YYYY-MM-DD');
  }
  setEndDate(event: MatDatepickerInputEvent<Date>) {
    this.stockQueryModel.EndDate=this.moment(event.value).format('YYYY-MM-DD');
  }
  selectTime(id){
    this.clearActiveStyle();
    this.timeSelection[id].isSelected=true;
    //
    switch (id)
    {
      case 0:
        let oneMonth=this.moment().add(-1, 'months').format('YYYY-MM-DD');
        this.stockQueryModel.StartDate=oneMonth;
        break;
      case 1:
        let threeMonth=this.moment().add(-3, 'months').format('YYYY-MM-DD');
        this.stockQueryModel.StartDate=threeMonth;
        break;
      case 2:
        let halfYear=this.moment().add(-6, 'months').format('YYYY-MM-DD');
        this.stockQueryModel.StartDate=halfYear;
        break;
      case 3:
        let oneYear=this.moment().add(-12, 'months').format('YYYY-MM-DD');
        this.stockQueryModel.StartDate=oneYear;
        break;
      case 4:
        let threeYear=this.moment().add(-3, 'years').format('YYYY-MM-DD');
        this.stockQueryModel.StartDate=threeYear;
        break;
      case 5:
        let fiveYear=this.moment().add(-5, 'years').format('YYYY-MM-DD');
        this.stockQueryModel.StartDate=fiveYear;
        break;
      case 6:
        let thisYear=this.moment().get('year');
        this.stockQueryModel.StartDate=thisYear+'-01-01';
        break;
      default:
        break;
    }
    this.GetSHStockIndex();
  }
  clearActiveStyle(){
    this.timeSelection.forEach((item)=>{
      item.isSelected=false;
    });
  }
  GetSHStockIndex(){
      if(this.stockQueryModel.StartDate==='' || this.stockQueryModel.EndDate===''){
        return false;
      }
      this.isQueryPanelLoading=true;
      this.stockQueryModel.StartDate=this.stockQueryModel.StartDate.replace(/-/g,'');
      this.stockQueryModel.EndDate=this.stockQueryModel.EndDate.replace(/-/g,'');
      this.apiService.GetSHStockIndex(this.stockQueryModel).subscribe(
        data=>{
          this.isQueryPanelLoading=false;
          this.chartData=data[0].hq.reverse();
        },
        error=>{
          this.isQueryPanelLoading=false;
          console.log(error);
        }
      );
  }
  ClearAll(){
    this.fundToolSingleModel=new FundToolSingleModel();
  }
  ClearBoth(){
    this.fundToolSingleModel.DailyRate='';
    this.fundToolSingleModel.FixedInvestment='';
  }
  Calc(){
    let M = Number(this.fundToolSingleModel.CurrentMoney);
    let F = Number(this.fundToolSingleModel.FixedInvestment);
    let R = Number(this.fundToolSingleModel.DailyRate);
    let newResult = (M+F)*(1+R/100);
    this.fundToolSingleModel.CurrentMoney = newResult.toFixed(2);
    this.ClearBoth();
  }
}

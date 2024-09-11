import {Component,ViewChild,OnInit} from "@angular/core";
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {ApiService} from '../../service/api.service';
import {AuthService} from '../../service/auth.service';
import {CommonService} from '../../service/common.service';
import {AnalyzeResultModel} from './analyze-result.model';
import {AnalyzeFundModel} from './analyze-fund.model';
import {AnalyzeSingleDetailModel} from './analyze-single-detail.model';
import {ErrorHandleService} from '../../service/error-handle.service';
declare let require:any;
declare let $:any;

@Component({
  templateUrl:'mock-invest.template.html',
  styleUrls:['mock-invest.style.css'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'zh-cn'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})

export class MockInvestComponent implements OnInit{

  moment:any=require('moment');
  allFunds:any=[];
  allInvestWays:any=[
    {
      id: '1',
      text: '不定投'
    },
    {
      id: '2',
      text: '每日定投'
    },
    {
      id: '3',
      text: '逢跌定投'
    }
  ];
  chartData:any=[];
  analyzeFundModel:AnalyzeFundModel=new AnalyzeFundModel();
  analyzeResultModel:AnalyzeResultModel=new AnalyzeResultModel();
  data:Array<AnalyzeSingleDetailModel>=[];
  isQueryPanelLoading=false;
  isBlankResult=true;


  constructor(
    private apiService:ApiService,
    public authService:AuthService,
    private errorHandleService:ErrorHandleService,
    private commonService:CommonService
  ){}

  ngOnInit(){
      if(this.authService.isLoggedIn){
        this.initSelect();
      }

  }

  setInvestWay($event){
    this.analyzeFundModel.InvestWay=$event.value;
  }

  setStartDate(event: MatDatepickerInputEvent<Date>) {
    this.analyzeFundModel.StartDate=this.moment(event.value).format('YYYY-MM-DD');
  }
  setEndDate(event: MatDatepickerInputEvent<Date>) {
    this.analyzeFundModel.EndDate=this.moment(event.value).format('YYYY-MM-DD');
  }

  initSelect(){
    this.apiService.GetMyFunds().subscribe(
      data=>{
        let array=[];
        data.forEach((item)=>{
          array.push({
            id:item.FundCode,
            text:item.FundCode+' '+item.FundName
          });
        });
        this.allFunds=array;
      },
      error=>{
        this.errorHandleService.errorHandle(error);
      }
    );
  }
  selectFundOnChange($event){
    this.analyzeFundModel.FundNo=$event.value;
  }
  setResult(){
    this.analyzeResultModel.DateRange=this.data.length;
    this.analyzeResultModel.FundName=this.setFundName();
    this.analyzeResultModel.StartDate=this.analyzeFundModel.StartDate;
    this.analyzeResultModel.EndDate=this.analyzeFundModel.EndDate;
    this.analyzeResultModel.Profit=(Number(this.analyzeResultModel.BackMoney)-Number(this.analyzeResultModel.AllInvest)).toFixed(2);
    this.analyzeResultModel.ReturnRate=((Number(this.analyzeResultModel.Profit) / Number(this.analyzeResultModel.AllInvest))*100).toFixed(2);
  }

  setFundName(){
    let obj:any=this.allFunds.filter(item=>item.id===this.analyzeFundModel.FundNo)[0];
    return obj.text;
  }
  Run(){
    this.isQueryPanelLoading=true;
    this.apiService.GetFundData(this.analyzeFundModel).subscribe(
      data=>{
        let dataArray=this.commonService.parserDomToChartData(data);
        this.chartData=dataArray;
        let dataLength=dataArray.length;
        //处理表格
        //不定投
        if(this.analyzeFundModel.InvestWay==='1'){
          let dataList=[];
          let tempMoney=Number(this.analyzeFundModel.InitialMoney);
          for(let i=0;i<dataArray.length;i++){
            let tempItem=dataArray[i];
            let singleData=new AnalyzeSingleDetailModel();
            singleData.Date=tempItem.date;
            singleData.StartMoney=tempMoney;
            singleData.Rate=tempItem.rate;
            singleData.EndMoney=Number((tempMoney*(1+tempItem.rate/100)).toFixed(2));
            tempMoney=singleData.EndMoney;
            singleData.Profit=Number((singleData.EndMoney-singleData.StartMoney).toFixed(2));
            singleData.FixedInvest='-';
            dataList.push(singleData);
          }
          this.data=dataList;
          this.analyzeResultModel.AllInvest=this.analyzeFundModel.InitialMoney;
          this.analyzeResultModel.BackMoney=dataList[dataList.length-1].EndMoney;
        }else if(this.analyzeFundModel.InvestWay==='2'){//每日定投
          let dataList=[];
          let tempMoney=Number(this.analyzeFundModel.InitialMoney);
          for(let i=0;i<dataArray.length;i++){
            let tempItem=dataArray[i];
            let singleData=new AnalyzeSingleDetailModel();
            singleData.Date=tempItem.date;
            singleData.StartMoney=Number((tempMoney+(i===0||i===dataLength-1||i===dataLength?0:Number(this.analyzeFundModel.FixMoney))).toFixed(2));
            singleData.Rate=tempItem.rate;
            singleData.EndMoney=Number((singleData.StartMoney*(1+tempItem.rate/100)).toFixed(2));
            tempMoney=singleData.EndMoney;
            singleData.Profit=Number((singleData.EndMoney-singleData.StartMoney).toFixed(2));
            singleData.FixedInvest=(i===dataLength-2||i===dataLength-1)?'-':this.analyzeFundModel.FixMoney;
            dataList.push(singleData);
          }
          this.data=dataList;
          this.analyzeResultModel.AllInvest=(Number(this.analyzeFundModel.InitialMoney)+Number(this.analyzeFundModel.FixMoney)*(dataLength-2)).toFixed(0);
          this.analyzeResultModel.BackMoney=dataList[dataList.length-1].EndMoney;
        }else if(this.analyzeFundModel.InvestWay==='3'){//逢跌定投
          let dataList=[];
          let tempMoney=Number(this.analyzeFundModel.InitialMoney);
          let fixedInvestIndex=0;
          for(let i=0;i<dataArray.length;i++){
            let tempItem=dataArray[i];
            let singleData=new AnalyzeSingleDetailModel();
            singleData.Date=tempItem.date;
            singleData.StartMoney=Number(tempMoney.toFixed(2));
            singleData.Rate=tempItem.rate;
            singleData.EndMoney=Number((singleData.StartMoney*(1+tempItem.rate/100)).toFixed(2));
            tempMoney=singleData.EndMoney+((tempItem.rate<0 &&i < dataLength-2)?Number(this.analyzeFundModel.FixMoney):0);
            singleData.Profit=Number((singleData.EndMoney-singleData.StartMoney).toFixed(2));
            singleData.FixedInvest=(tempItem.rate<0 &&i < dataLength-2)?this.analyzeFundModel.FixMoney:'-';
            dataList.push(singleData);
            if(tempItem.rate<0 && i < dataLength-2){
              fixedInvestIndex++;
            }
          }
          this.data=dataList;
          this.analyzeResultModel.AllInvest=(Number(this.analyzeFundModel.InitialMoney)+Number(this.analyzeFundModel.FixMoney)* fixedInvestIndex).toFixed(0);
          this.analyzeResultModel.BackMoney=dataList[dataList.length-1].EndMoney;
        }
        //模拟结果
        this.analyzeResultModel.Rate=(((dataArray[dataLength-1].value / dataArray[0].value)-1)*100).toFixed(2);
        this.setResult();
        this.isBlankResult=false;
        this.isQueryPanelLoading=false;
      },
      error=>{
        this.errorHandleService.errorHandle(error);
        this.isQueryPanelLoading=false;
      }
    );
  }

}

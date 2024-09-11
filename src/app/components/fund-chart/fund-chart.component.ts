import {Component,OnChanges,OnInit,Input} from "@angular/core";
declare let require:any;
declare let echarts:any;

@Component({
  selector:'fund-chart',
  templateUrl:'fund-chart.template.html',
  styleUrls:['fund-chart.style.css']
})

export class FundChartComponent implements OnChanges{

  @Input('ChartData') ChartData:any;
  myChart:any;
  constructor(){

  }
  ngOnChanges(){
    if(!this.myChart){
      this.myChart = echarts.init(document.getElementById('fund-chart-element'),'roma');
    }
    let option = {
      tooltip: {
        trigger: 'axis'
      },
      grid:{
        top:40,
        bottom:35,
        left:50,
        right:50
      },
      legend: {
        top:8,
        data:['单位净值']
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            iconStyle:{
              normal:{
                textPosition:'left'
              }
            }
          }
        },
        right:20
      },
      xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: this.setxAxisData()
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:'单位净值',
          type:'line',
          showSymbol: false,
          data:this.setyAxisData()
        }
      ]
    };
    this.myChart.setOption(option);
  }

  setxAxisData(){
    let dataArray=[];
    for(let n in this.ChartData){
      dataArray.push(this.ChartData[n].date);
    }
    return dataArray;
  }
  setyAxisData(){
    let dataArray=[];
    for(let n in this.ChartData){
      dataArray.push(this.ChartData[n].value);
    }
    return dataArray;
  }

}

import {Component,OnChanges,OnInit,Input} from "@angular/core";
declare let require:any;
declare let echarts:any;

@Component({
  selector:'rate-chart',
  templateUrl:'rate-chart.template.html',
  styleUrls:['rate-chart.style.css']
})

export class RateChartComponent implements OnChanges{

  @Input('ChartData') ChartData:any;
  myChart:any;
  constructor(){

  }
  ngOnChanges(){
    if(!this.myChart){
      this.myChart = echarts.init(document.getElementById('rate-chart-element'),'roma');
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
        data:['日增长率']
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
          name:'日增长率',
          type:'bar',
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
      dataArray.push(this.ChartData[n].rate);
    }
    return dataArray;
  }

}

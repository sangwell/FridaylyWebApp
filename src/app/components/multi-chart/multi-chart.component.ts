import {Component,OnChanges,OnInit,Input} from "@angular/core";
declare let require:any;
declare let echarts:any;

@Component({
  selector:'multi-chart',
  templateUrl:'multi-chart.template.html',
  styleUrls:['multi-chart.style.css']
})

export class MultiChartComponent implements OnChanges{

  @Input('ChartData') ChartData:any;
  @Input('SHStockIndexData') SHStockIndexData:any;
  myChart:any;
  constructor(){

  }
  ngOnChanges(){
    if(this.ChartData.length===0){
      return false;
    }

    if(!this.myChart){
      this.myChart = echarts.init(document.getElementById('multi-chart-element'));
    }
    let option = {
      tooltip: {
        trigger: 'axis'
      },
      grid:{
        top:70,
        bottom:35,
        left:50,
        right:50
      },
      legend: {
        top:8,
        data:this.setLegend()
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
      yAxis: [
        {
          type: 'value',
          name: '单位净值',
          position: 'left'
        },
        {
          type: 'value',
          show:this.SHStockIndexData.length>0,
          name: '上证指数',
          position: 'right',
          splitLine:{
            show:false
          }
        },
      ],
      series: this.setSeries()
    };
    this.myChart.setOption(option);
  }

  // setxAxisData(){
  //   let dataArray=[];
  //   for(let n in this.ChartData){
  //     dataArray.push(this.ChartData[n].date);
  //   }
  //   return dataArray;
  // }
  setyAxisData(){
    let dataArray=[];
    for(let n in this.ChartData){
      dataArray.push(this.ChartData[n].value);
    }
    return dataArray;
  }
  setLegend() {
    let legend=[];
    this.ChartData.forEach((item)=>{
      legend.push(item.name);
    });
    if(this.SHStockIndexData.length>0){
      legend.push(this.SHStockIndexData[0].name);
    }
    return legend;
  }
  setxAxisData(){
    let dataArray=[];
    let data=this.ChartData[0].data;
    for(let n in data){
      dataArray.push(data[n].date);
    }
    return dataArray;
  }
  setSeries() {
    let series=[];
    for(let i=0;i<this.ChartData.length;i++){
      let item=this.ChartData[i];
      let single={
        name:item.name,
        type:'line',
        yAxisIndex: 0,
        showSymbol: false,
        data:[]
      };
      let data=item.data;
      for(let n in data){
        single.data.push(data[n].value);
      }
      series.push(single);

    }

    if(this.SHStockIndexData.length>0){
      for(let i=0;i<this.SHStockIndexData.length;i++){
        let item=this.SHStockIndexData[i];
        let single={
          name:item.name,
          type:'line',
          yAxisIndex: 1,
          showSymbol: false,
          data:[]
        };
        let data=item.data;
        for(let n in data){
          single.data.push(data[n].value);
        }
        series.push(single);

      }
    }
    return series;
  }





}

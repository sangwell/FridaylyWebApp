import {Component,OnChanges,OnInit,Input} from "@angular/core";
declare let require:any;
declare let echarts:any;

@Component({
  selector:'stock-chart',
  templateUrl:'stock-chart.template.html',
  styleUrls:['stock-chart.style.css']
})

export class StockChartComponent implements OnChanges{

  @Input('ChartData') ChartData:any;
  myChart:any;
  dates:any;
  data:any;
  constructor(){

  }
  ngOnChanges(){
    if(!this.myChart){
      this.myChart = echarts.init(document.getElementById('stock-chart-element'),'roma');
    }
    this.dates = this.ChartData.map(function (item) {
      return item[0];
    });

    this.data = this.ChartData.map(function (item) {
      return [+item[1], +item[2], +item[5], +item[6]];
    });
    let option = {
      // backgroundColor: '#21202D',//#21202D
      legend: {
        data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false,
          type: 'cross',
          lineStyle: {
            color: '#376df4',
            width: 2,
            opacity: 1
          }
        }
      },
      toolbox:{
        feature:{
          saveAsImage:{
            name:'股市历史行情'
          }
        }
      },
      xAxis: {
        type: 'category',
        data: this.dates,
        axisLine: { lineStyle: { color: '#8392A5' } }
      },
      yAxis: {
        scale: true,
        axisLine: { lineStyle: { color: '#8392A5' } },
        splitLine: { show: false }
      },
      grid: {
        bottom: 70,
        left:60,
        right:30,
        top:30
      },
      dataZoom: [{
        textStyle: {
          color: '#8392A5'
        },
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        dataBackground: {
          areaStyle: {
            color: '#8392A5'
          },
          lineStyle: {
            opacity: 0.8,
            color: '#8392A5'
          }
        },
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside'
      }],
      animation: false,
      series: [
        {
          type: 'candlestick',
          name: '日K',
          data: this.data,
          itemStyle: {
            normal: {
              color: '#cb1300',//#FD1050
              color0: '#02b342',
              borderColor: '#cb1300',
              borderColor0: '#02b342'//#0CF49B
            }
          }
        },
        {
          name: 'MA5',
          type: 'line',
          data: this.calculateMA(5, this.data),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        {
          name: 'MA10',
          type: 'line',
          data: this.calculateMA(10, this.data),
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        {
          name: 'MA20',
          type: 'line',
          data: this.calculateMA(20, this.data),
          itemStyle: {
            normal: {
              color: '#0064fd',//#FD1050
              borderColor: '#0064fd',
            }
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        {
          name: 'MA30',
          type: 'line',
          data: this.calculateMA(30, this.data),
          itemStyle: {
            normal: {
              color: '#00b01a',//#FD1050
              borderColor: '#00b01a',
            }
          },
          smooth: true,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          }
        }
      ]
    };
    this.myChart.setOption(option);
  }

  calculateMA(dayCount, data) {
    let result = [];
    for (let i = 0, len = data.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += data[i - j][1];
      }
      result.push(sum / dayCount);
    }
    return result;
  }

}

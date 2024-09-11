import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StockChartComponent} from "./stock-chart.component";

@NgModule({
  imports:[CommonModule],
  declarations:[
    StockChartComponent
  ],
  exports:[
    StockChartComponent
  ]
})

export class StockChartModule{}

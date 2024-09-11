import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FundChartComponent} from "./fund-chart.component";

@NgModule({
  imports:[CommonModule],
  declarations:[
    FundChartComponent
  ],
  exports:[
    FundChartComponent
  ]
})

export class FundChartModule{}

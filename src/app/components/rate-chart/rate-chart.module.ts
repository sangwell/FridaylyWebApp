import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RateChartComponent} from "./rate-chart.component";

@NgModule({
  imports:[CommonModule],
  declarations:[
    RateChartComponent
  ],
  exports:[
    RateChartComponent
  ]
})

export class RateChartModule{}

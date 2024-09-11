import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MultiChartComponent} from "./multi-chart.component";

@NgModule({
  imports:[CommonModule],
  declarations:[
    MultiChartComponent
  ],
  exports:[
    MultiChartComponent
  ]
})

export class MultiChartModule{}

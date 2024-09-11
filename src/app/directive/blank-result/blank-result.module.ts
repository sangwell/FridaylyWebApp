import { NgModule }      from '@angular/core';

import { BlankResultComponent } from './blank-result.component';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [CommonModule],

  declarations: [
    BlankResultComponent
  ],

  exports: [
    BlankResultComponent
  ],

})
export class BlankResultModule {
}

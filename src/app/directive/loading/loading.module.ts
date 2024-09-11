import { NgModule }      from '@angular/core';

import { LoadingComponent } from './loading.component';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [CommonModule],

  declarations: [
    LoadingComponent
  ],

  exports: [
    LoadingComponent
  ],

})
export class LoadingModule {
}

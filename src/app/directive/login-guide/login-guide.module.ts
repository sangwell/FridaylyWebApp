import { NgModule }      from '@angular/core';
import { RouterModule }   from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

import { LoginGuideComponent } from './login-guide.component';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule
  ],

  declarations: [
    LoginGuideComponent
  ],

  exports: [
    LoginGuideComponent
  ],

})
export class LoginGuideModule {
}

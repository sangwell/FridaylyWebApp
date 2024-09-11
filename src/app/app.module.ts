import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from '@angular/common/http';
import { RouterModule }   from '@angular/router';
import { Router } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule,MatNativeDateModule} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {DataTableModule} from "angular2-datatable";
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {LoadingModule} from './directive/loading/loading.module';
import {BlankResultModule} from './directive/blank-result/blank-result.module';
import {LoginGuideModule} from './directive/login-guide/login-guide.module';


import { AppComponent } from './app.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {MockInvestComponent} from './components/mock-invest/mock-invest.component';
import {FundManageComponent} from './components/fund-manage/fund-manage.component';
import {FundToolComponent} from './components/fund-tool/fund-tool.component';
import {FundChartModule} from './components/fund-chart/fund-chart.module';
import {MultiChartModule} from './components/multi-chart/multi-chart.module';
import {RateChartModule} from './components/rate-chart/rate-chart.module';
import {StockChartModule} from './components/stock-chart/stock-chart.module';
import {ApiService,OnlyLoggedInUsersGuard} from './service/api.service';
import {ErrorHandleService} from './service/error-handle.service';
import {AuthGuard} from './service/auth-guard.service';
import {AuthService} from './service/auth.service';
import {CommonService} from './service/common.service';
import {FundRecommendComponent} from './components/home-page/fund-recommend/fund-recommend.component';
import {AddFundComponent} from './components/fund-manage/add-fund/add-fund.component';
import {UpdateFundComponent} from './components/fund-manage/update-fund/update-fund.component';
import {DeleteFundComponent} from './components/fund-manage/delete-fund/delete-fund.component';

const route=[
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomePageComponent
  },
  {
    path: 'mock-invest',
    component: MockInvestComponent//canActivate: [AuthGuard]

  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'fund-manage',
    component: FundManageComponent
  },
  {
    path: 'fund-tool',
    component: FundToolComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(route,{useHash:true}),
    BrowserAnimationsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    FundChartModule,
    MultiChartModule,
    RateChartModule,
    StockChartModule,
    DataTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatCardModule,
    LoadingModule,
    BlankResultModule,
    LoginGuideModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomePageComponent,
    MockInvestComponent,
    FundManageComponent,
    FundToolComponent,
    FundRecommendComponent,
    AddFundComponent,
    UpdateFundComponent,
    DeleteFundComponent
  ],
  providers: [
    ApiService,
    OnlyLoggedInUsersGuard,
    AuthGuard,
    AuthService,
    ErrorHandleService,
    CommonService
  ],
  entryComponents:[
    FundRecommendComponent,
    AddFundComponent,
    UpdateFundComponent,
    DeleteFundComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

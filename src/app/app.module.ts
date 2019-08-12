import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HistoryPage } from '../pages/history/history';
import { LoadingPage } from '../pages/loading/loading';
import { LoginPage } from '../pages/login/login';
import { AboutPage } from '../pages/about/about';
import { CreateCompanyPage } from '../pages/create-company/create-company';
import { ManageEmployeePage } from '../pages/manage-employee/manage-employee';
import { MyCompanyPage } from '../pages/my-company/my-company';
import { FindCompanyPage } from '../pages/find-company/find-company';

import { CheckinProvider } from '../providers/checkin-provider'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoadingPage,
    HistoryPage,
    LoginPage,
    AboutPage,
    CreateCompanyPage,
    ManageEmployeePage,
    MyCompanyPage,
    FindCompanyPage
  ],
  imports: [
    // IonicModule.forRoot(MyApp)
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoadingPage,
    HistoryPage,
    LoginPage,
    AboutPage,
    CreateCompanyPage,
    ManageEmployeePage,
    MyCompanyPage,
    FindCompanyPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Storage, CheckinProvider]
})
export class AppModule {

}

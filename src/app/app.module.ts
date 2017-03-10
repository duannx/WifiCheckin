import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HistoryPage } from '../pages/history/history'; 
import { LoadingPage } from '../pages/loading/loading'; 
import { CheckinProvider } from '../providers/checkin-provider'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoadingPage,
    HistoryPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoadingPage,
    HistoryPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Storage, CheckinProvider]
})
export class AppModule {
    
}

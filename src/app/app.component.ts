import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage'
import { HomePage } from '../pages/home/home';
import { LoadingPage } from '../pages/loading/loading';
import { LoginPage } from '../pages/login/login';
import { FindCompanyPage } from '../pages/find-company/find-company';
import { CreateCompanyPage } from '../pages/create-company/create-company';
import {} from '../pages/create-company/create-company'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, public storage: Storage) {
    this.rootPage = LoginPage;
    // this.rootPage = HomePage;
    // this.rootPage = CreateCompanyPage;    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}

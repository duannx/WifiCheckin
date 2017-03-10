import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage'
import { HomePage } from '../pages/home/home';
import { LoadingPage } from '../pages/loading/loading'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, public storage: Storage) {
    this.rootPage = HomePage;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      // this.storage.ready().then(() => {
      //   //Check data in local storage. If null fecth data then hide loadercss. Else hide loader css then fetch data
      //   this.storage.get("dataSettedUp").then((dataLocal) => {
      //     if (dataLocal != null) {
      //       //Exists data in local
      //       this.rootPage = HomePage;
      //     } else {
      //       this.rootPage = LoadingPage
      //     }
      //   })
      // })
    });
  }
}

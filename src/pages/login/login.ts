import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }
  ionViewDidLoad() {
    console.log(Date.parse("Wen, 01 Feb 2017 17:30:00"));
  }
  goToHomePage() {
    this.navCtrl.setRoot(HomePage);
  }
}

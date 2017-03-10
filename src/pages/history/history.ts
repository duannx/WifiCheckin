import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the History page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
  currentMonth = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let date = new Date();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.currentMonth = months[date.getMonth()].toString() + " - " + date.getFullYear();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

}

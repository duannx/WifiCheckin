import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
 
@Component({
  selector: 'page-find-company',
  templateUrl: 'find-company.html'
})
export class FindCompanyPage { 
  loading = true;
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindCompanyPage');
  }

}

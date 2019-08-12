import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FindCompanyPage } from '../find-company/find-company';
import { CreateCompanyPage } from '../create-company/create-company';
@Component({
  selector: 'page-my-company',
  templateUrl: 'my-company.html'
})
export class MyCompanyPage {
  hasCompany = false;
  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyCompanyPage');
  }

  gotoFindCompanyPage() {
    this.navCtrl.push(FindCompanyPage);
  }
  gotoCreateCompanyPage() {
    this.navCtrl.push(CreateCompanyPage);
  }
}

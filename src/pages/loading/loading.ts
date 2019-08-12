import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { CheckinProvider } from '../../providers/checkin-provider';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { MyCompanyPage } from '../my-company/my-company'
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class LoadingPage {
  loadingText = "Getting your data";
  constructor(public navCtrl: NavController, public navParams: NavParams, public checkinProvider: CheckinProvider, public storage: Storage, public platform: Platform) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoadingPage');
    this.platform.ready().then(() => {
      this.storage.get('email').then(email => {
        this.storage.get('username').then(name => {
          this.checkinProvider.serverLoginThirdParty(email, name, "acesstoken").then(res => {
            console.log("server login success", JSON.parse(res._body));
            let body = JSON.parse(res._body);
            let token = body.token;
            let userId = body.userId;
            this.storage.set('access_token', token);
            this.storage.set('userId', userId);
            this.checkinProvider.refreshData();
            if (body.hasCompany != null && body.hasCompany != undefined && body.hasCompany.toString() == 'true')
              this.navCtrl.setRoot(HomePage);
            else
              this.navCtrl.setRoot(MyCompanyPage);
          }, error => {
            console.log("error", error);
          });
        })
      })
    })
    // this.checkinProvider.serverLoginThirdParty() 
  }
}

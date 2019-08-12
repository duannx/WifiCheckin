import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { CheckinProvider } from '../../providers/checkin-provider';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
declare var WifiWizard: any

@Component({
  selector: 'page-create-company',
  templateUrl: 'create-company.html'
})

export class CreateCompanyPage {
  compnaySize = 1;
  companyName = "";
  adress = "";
  wifiName = "";
  wifiMacid = "";
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtrl: AlertController, public checkinProvider: CheckinProvider, public storage: Storage) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCompanyPage');
    let txtWifi = document.getElementById("txtWifi");
    let btnCreate = document.getElementById("btnCreate");
    txtWifi.addEventListener('touchstart', (event) => {
      let alert = this.alertCtrl.create({
        title: "Company's wifi",
        subTitle: 'It is the wifi that your phone is connecting to. To change it, please connect to other wifi.',
        buttons: ['OK']
      });
      alert.present();
    });
    this.refresWifi();
  }

  createCompany() {
    if (this.companyName.trim() == "" || this.adress.trim() == "" || this.wifiName.trim() == "" || this.wifiMacid.trim() == "") {
      let alert = this.alertCtrl.create({
        title: "D'oh!",
        subTitle: 'Please fill up the form!',
        buttons: ['OK']
      });
      alert.present();
    } else {
      this.checkinProvider.serverCreateCompany(this.companyName, this.adress, this.compnaySize, this.wifiName, this.wifiMacid).then(res => {
        this.checkinProvider.makeToast(3000, "Create company successed!");
        let body = JSON.parse(res._body);
        this.storage.set("companyName", body.companyName);
        this.storage.set("companyId", body.companyId);
        this.storage.set("wifiName", body.wifiName);
        this.navCtrl.setRoot(HomePage, { "actieTab": 3 });
        console.log(JSON.parse(res._body));
      }, (error) => {
        this.checkinProvider.makeToast(3000, "Failed! Please try again later.");
      })
    }
  }

  refresWifi() {
    let iconRefresh = document.getElementById('icon-refresh');
    iconRefresh.classList.toggle('roltated');
    WifiWizard.getCurrentBSSID((macId) => {
      console.log("getCurrentBSSID success", macId);
      this.wifiMacid = macId;
      WifiWizard.getCurrentSSID((name) => {
        console.log("getCurrentSSID success", name);
        this.wifiName = name.toString();
      }, (error) => {
        console.log("getCurrentSSID Fail", error);
        this.wifiName = "";
      });
    }, (error) => {
      console.log("getCurrentBSSID Fail", error);
      this.wifiMacid = "";
      this.wifiName = "";
    });
  }
}

import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ToastController, Platform } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class CheckinProvider {
  domainName = "http://stark-garden-51779.herokuapp.com/";
  // domainName = "http://localhost:8081";
  apiPath = "api/v1/";
  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTQ4ODgwODE4MjZ9.QJkbTL4-p0yoYiYuVw7xsVfjWATZlDE8OHG48Dm5oak";
  userEmail = "xuanduannguyen@gmail.com";
  userid = "-Kdj4dOp_ULO6Zj4xb_V";
  company = "bGateCorp";
  constructor(public http: Http, public storage: Storage, public toastCtrl: ToastController, public platform: Platform) {
    console.log('Hello CheckinProvider Provider');
    this.platform.ready().then(() => {
      this.refreshData();
    })

  }
  //Local function
  localGetCheckinStatus(): Promise<any> {
    return this.storage.get("todayCheckedin");
  }

  //Server function
  serverLoginThirdParty(username: string, fullname: string, acessToken: string): Promise<any> {
    let body = {
      "username": username,
      "access_token": acessToken,
      "fullname": fullname
    };
    console.log("body login third party", body);
    return this.http.post(this.domainName + "loginthirdparty", body)
      .toPromise();
  }

  serverGetCheckinStatus(date: string): Promise<any> {
    let header: Headers = new Headers;

    header.append("username", this.userEmail);
    header.append("userid", this.userid);
    header.append("access_token", this.token);
    header.append("company", this.company);
    header.append("check_date", date);
    return this.http.get(this.domainName + this.apiPath + "checkin", { headers: header })
      .toPromise();
  }

  serverCheckin(macid: string): Promise<any> {
    let body = {
      "username": this.userEmail,
      "userid": this.userid,
      "access_token": this.token,
      "macid": macid,
      "company": this.company
    };

    return this.http.post(this.domainName + this.apiPath + "checkin", body)
      .toPromise();
  }

  serverCheckout(macid: string): Promise<any> {
    let body = {
      "username": this.userEmail,
      "userid": this.userid,
      "access_token": this.token,
      "macid": macid,
      "company": this.company
    };

    return this.http.post(this.domainName + this.apiPath + "checkout", body)
      .toPromise();
  }

  serverGetProducts(): Promise<any> {
    let body = {
      "username": this.userEmail,
      "userid": this.userid,
      "access_token": this.token,
      "company": this.company
    };

    return this.http.post(this.domainName + this.apiPath + "products", body)
      .toPromise();
  }

  serverGetCheckinHistory(startTime: number, endTime: number): Promise<any> {
    let body = {
      "username": this.userEmail,
      "userid": this.userid,
      "access_token": this.token,
      "start_time": startTime,
      "end_time": endTime
    };

    return this.http.post(this.domainName + this.apiPath + "history", body)
      .toPromise();
  }

  serverCreateCompany(companyName: string, companyAdress: string, companySize: number, wifiName: string, wifiMacid: string): Promise<any> {
    let body = {
      "username": this.userEmail,
      "userid": this.userid,
      "access_token": this.token,
      "companyname": companyName,
      "companyadress": companyAdress,
      "companysize": companySize,
      "wifiname": wifiName,
      "companymacid": wifiMacid,
    };
    console.log("create company body", body);

    return this.http.post(this.domainName + this.apiPath + "createcompany", body)
      .toPromise();
  }
  public refreshData() {
    this.storage.get('access_token').then(data => {
      this.token = data;
      console.log("access_token: ", data);
    });
    this.storage.get('email').then(data => {
      this.userEmail = data;
      console.log("user email: ", data);
    })
    this.storage.get('userId').then(data => {
      this.userid = data;
    })
  }
  private handleError(error: any): Promise<any> {
    console.log('An error occurred', error); // for demo purposes only;
    return Promise.reject(error.message || error);
  }
  makeToast(duration: number, message: string, position = 'bottom') {
    let toast = this.toastCtrl.create({
      duration: duration,
      message: message,
      position: position
    });
    toast.present();
  }
}
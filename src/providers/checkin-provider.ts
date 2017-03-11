import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class CheckinProvider {
  domainName = "http://stark-garden-51779.herokuapp.com";
  // domainName = "http://localhost:8081";
  apiPath = "/api/v1/";
  token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0ODk0NjIyMjEwODJ9.yR32vv_JpzmIXvVyggoDI2-yTyEzTdFCiJTkSuwFuUA";
  username = "xuanduannguyen@gmail.com";
  userid = "-Kdj4dOp_ULO6Zj4xb_V";
  company = "bGateCorp";
  constructor(public http: Http, public storage: Storage) {
    console.log('Hello CheckinProvider Provider');
  }

  localGetCheckinStatus(): Promise<any> {
    return this.storage.get("todayCheckedin");
  }

  serverGetCheckinStatus(date: string): Promise<any> {
    let header: Headers = new Headers;
    header.append("username", this.username);
    header.append("userid", this.userid);
    header.append("access_token", this.token);
    header.append("company", this.company);
    header.append("check_date", date);
    return this.http.get(this.domainName + this.apiPath + "checkin", { headers: header })
      .toPromise();
  }

  serverCheckin(macid: string): Promise<any> {
    let body = {
      "username": this.username,
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
      "username": this.username,
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
      "username": this.username,
      "userid": this.userid,
      "access_token": this.token,
      "company": this.company
    };

    return this.http.post(this.domainName + this.apiPath + "getProduct", body)
      .toPromise();
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
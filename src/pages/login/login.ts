import { Component } from '@angular/core';

import { NavController, ToastController, Platform } from 'ionic-angular';
import { LoadingPage } from '../loading/loading';
import { MyCompanyPage } from '../my-company/my-company';
import { Facebook, GooglePlus } from 'ionic-native';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private firstClicked = 0;

  private facebookUserId = "";
  private facebookAccessToken = "";

  private name = "";
  constructor(public navCtrl: NavController, public http: Http, public toastCtrl: ToastController, public platform: Platform, public storage: Storage) {
    platform.ready().then(() => {
      storage.ready().then(() => {
        this.storage.get("isLoggedIn").then((isLoggedIn) => {
          if (isLoggedIn == true) {
            this.gotoLoadingPage();
          }
        })
      });
    })
  }
  ionViewDidLoad() {
  }
  gotoLoadingPage() {
    this.navCtrl.setRoot(LoadingPage);
  }

  loginWithFacebook() {
    Facebook.login(["public_profile","email"]).then((response) => {
      console.log("Login success", response);
      this.facebookUserId = response.authResponse.userID;
      this.facebookAccessToken = response.authResponse.accessToken;
      this.storage.set('isLoggedIn', true);
      this.storage.set('logginType', 'facebook');
      this.storage.set('facebookUserId', response.authResponse.userID);
      this.storage.set('facebookAccessToken', response.authResponse.accessToken)
      this.getFacebookInfo();
    }, (error) => {
      console.log("Login fail", error);
    })
  }
  getFacebookInfo() {
    let url = 'https://graph.facebook.com/v2.8/' + this.facebookUserId + '?access_token=' + this.facebookAccessToken + '&fields=name,email,picture.width(100).height(100).as(picture_small)&perms=email';
    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
    this.http.get(url, { headers: header }).subscribe((success) => {
      console.log("get success", success.json());
      this.getFacebookSucces(success.json());
      this.showToast("Facebook login success", 3000); 
    }, (error) => {
      console.log("error", error.json());
      this.showToast("Facebook login error", 3000);
      Facebook.logout();
      this.storage.set('isLoggedIn', false);
    });
  }

  getFacebookSucces(success) {
    if (success.hasOwnProperty('email')) {
      this.storage.set('email', success.email);
    } else {
      this.showToast("We can't get your facebook account's email. Please allow it or try loggin with other account", 5000);
      Facebook.logout();
      this.storage.set('isLoggedIn', false);
      return;
    }

    if (success.hasOwnProperty('name'))
      this.storage.set('username', success.name);

    if (success.hasOwnProperty('picture_small'))
      this.storage.set('useravata', success.picture_small.data.url);
      this.gotoLoadingPage();
    console.log('name', this.name);
    console.log("picture", success.picture_small.data.url);
  }

  loginWithGoogle() {
    console.log("Google login here");
    GooglePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '438845150599-2khdiusa2cmo7f2gmq0b8amj5lkem736.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    }).then(
      (response) => {
        console.log("goole login success: ", response);
        this.storage.set('isLoggedIn', true);
        this.storage.set('logginType', 'google');
        this.storage.set('username', response.displayName);
        this.storage.set('email', response.email);
        this.storage.set('useravata', response.imageUrl);
        this.showToast("Google login success", 3000);
        this.gotoLoadingPage();
      },
      (error) => {
        console.log("Google login error: ", error);
        this.showToast("Google login error", 3000);
      });
  }

  showToast(message: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: "top"
    })
    toast.present();
  }

  trylocalLogin() {
    let nowClicked = new Date().getTime();
    if (nowClicked - this.firstClicked <= 1000) this.gotoLoadingPage();
    else this.firstClicked = nowClicked;
  }
}

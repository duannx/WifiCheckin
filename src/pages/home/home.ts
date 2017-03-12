import { Component } from '@angular/core';
import { Platform, ToastController, NavController, AlertController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage'
import { CheckinProvider } from '../../providers/checkin-provider';
import { HistoryPage } from '../history/history';
import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { Facebook, GooglePlus } from 'ionic-native';
declare var WifiWizard: any
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //user data
  avatar = "assets/images/avatar.png";
  name = "";
  //loader css varible
  displayLoader = "block";
  loadingText = "Loading ...";
  //Product varible
  foods: any;
  currentFood: any;
  //check in varible
  currentDate = "";
  checkinData = { "checkInTime": 0, "checkOutTime": 0, "today": "" };
  checkinStatus = { "checkedin": false, "checkedout": false }
  checkinClass = "progress-default";
  checkoutClass = "progress-default";
  checkinProgress = 0;
  checkoutProgress = 0;
  checkinText = "<span>Not Yet!</span>";
  checkoutText = "<span>Pending...</span>";
  alertText = "";
  showAlertText = false;
  // Custom tab varible
  private numTabs = 3;
  private currentTab = 1;
  private tabContent: HTMLElement;
  private tabHighLight: HTMLElement;
  private frameWidth = 360;
  private frameHeight = 640;
  private scrollLeft = 0;
  private fpa = 15; //frame per animate

  private firstTouchX: number;
  private lastTouchX: number;
  private firstTouchY: number;
  private lastTouchY: number;
  private direction: number = 0; // 1 = vetical; 2 =  horizontal;  0 = unknow
  private firstTouchTime: number;
  private lastTouchTime: number;
  private holdDirection: number = 0; //while hold directon != 0 can not change the direction in touchmove

  private firstClientX: number;
  private lastClientX: number;
  private firstClientY: number;
  private lastClientY: number;
  private nowDriection: number = 0; //1 = vertical; 2 = horizontal ; 0 = none;

  private requestId; //id of requestAnimationFrame

  private activeTab1 = true;
  private activeTab2 = false;
  private activeTab3 = false;
  //End Custom tab varible

  constructor(platform: Platform, public toastCtrl: ToastController, public navCtrl: NavController, public storage: Storage, public checkinProvider: CheckinProvider, public alertCtrl: AlertController) {
    let date = new Date();
    this.currentDate = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear();
    platform.ready().then(() => {
      setTimeout(() => {
        this.activeTab2 = true;
      }, 5000);
      setTimeout(() => {
        this.activeTab3 = true;
      }, 10000);
      StatusBar.styleDefault();
      Splashscreen.hide();
      // this.getCheckinStatus();
      this.storage.ready().then(() => {
        this.storage.get("useravata").then((val) => {
          this.avatar = val;
        })
        this.storage.get("username").then((val) => {
          this.name = val;
        })
      })
      this.checkinProvider.serverGetProducts().then((res) => {
        let body = JSON.parse(res._body);
        let m: string[]
        this.foods = this.transform(body, m);
      }, (rej) => {
        console.log("connect failed");
      })
    });

  }
  ngOnInit() {

  }
  // Custom tab function
  ngAfterViewInit() {

    this.tabContent = document.getElementById('tab-content');
    this.frameWidth = this.tabContent.clientWidth;
    this.frameHeight = this.tabContent.clientHeight;
    this.scrollLeft = this.tabContent.scrollLeft;
    this.tabHighLight = document.getElementById('tab-highlight-content');

    if (this.tabContent == undefined) return;
    this.tabContent.addEventListener('touchmove', (event) => {
      this.lastClientX = event.touches[0].clientX;
      this.lastClientY = event.touches[0].clientY;
      let distanceXAbs = Math.abs(this.lastClientX - this.firstClientX);
      let distanceYAbs = Math.abs(this.lastClientY - this.firstClientY);
      console.log("distanceX: ", distanceXAbs);
      console.log("distanceY: ", distanceYAbs);

      if (this.nowDriection == 1) {
        return;
      } else {
        if (this.nowDriection == 2) {
          event.preventDefault();
          let distanceX = this.lastTouchX - event.touches[0].clientX;
          cancelAnimationFrame(this.requestId);
          this.scrollToLeft(this.tabContent.scrollLeft + distanceX, this.frameWidth / this.fpa, 100 / this.numTabs / this.fpa);

          this.lastTouchX = event.touches[0].clientX;
          this.lastTouchY = event.touches[0].clientY;
        } else {
          event.preventDefault();
          (distanceXAbs - distanceYAbs) < 0 ? this.nowDriection = 1 : this.nowDriection = 2;
        }
      }

      console.log("child scroll direction: " + this.nowDriection);


    })

    this.tabContent.addEventListener("touchend", (event) => {
      this.lastTouchTime = new Date().getTime();
      let distance = Math.abs(this.lastTouchX - this.firstTouchX);
      let velocity = distance / (this.lastTouchTime - this.firstTouchTime);
      if (distance >= 100 || (distance >= 20 && velocity >= 0.5)) {
        this.currentTab += (this.firstTouchX - this.lastTouchX) / distance;
      }
      if (this.currentTab == 0) { this.currentTab = 1; return; }
      if (this.currentTab == this.numTabs + 1) { this.currentTab = this.numTabs; return; }
      this.activeTab(this.currentTab);
      this.direction = 0;
    });

    this.tabContent.addEventListener('touchstart', (event) => {
      this.firstTouchX = event.touches[0].clientX;
      this.lastTouchX = event.touches[0].clientX;
      this.firstTouchY = event.touches[0].clientY;
      this.lastTouchY = event.touches[0].clientY;
      this.firstTouchTime = new Date().getTime();

      this.firstClientX = event.touches[0].clientX;
      this.lastClientX = event.touches[0].clientX;
      this.firstClientY = event.touches[0].clientY;
      this.lastClientY = event.touches[0].clientY;
      this.nowDriection = 0;
    });

    let tabItemContents = <HTMLCollection>document.getElementsByClassName('tab-item-content');
    for (let i = 0; i < tabItemContents.length; i++) {
      let tabItemContent = <HTMLDivElement>tabItemContents[i];
      tabItemContent.addEventListener("touchmove", (event) => {
        event.preventDefault();
        if (this.holdDirection == 2) {
          this.direction = this.holdDirection;
          return
        };
        switch (this.direction) {
          case 1: { // vetical scroll
            event.stopPropagation();
            let thisElm = <HTMLDivElement>event.currentTarget;
            let distanceY = this.lastTouchY - event.touches[0].clientY;
            this.scrollToTop(thisElm, thisElm.scrollTop + distanceY, this.frameHeight / this.fpa);
            this.lastTouchY = event.touches[0].clientY;
            break;
          }
          case 2: { // horizontal scroll
            return;
          }
          default: { // unknow
            event.stopPropagation();
            let distanceX = Math.abs(event.touches[0].clientX - this.firstTouchX);
            let distanceY = Math.abs(event.touches[0].clientY - this.firstTouchY);
            if (distanceX > distanceY) this.direction = 2;
            else this.direction = 1;
            break;
          }
        }
      });

      tabItemContent.addEventListener("touchend", (event) => {
        if (this.direction == 1) {
          let thisElm = <HTMLDivElement>event.currentTarget;
          this.lastTouchTime = new Date().getTime();
          let distance = this.firstTouchY - this.lastTouchY;
          let duration = this.lastTouchTime - this.firstTouchTime
          let velocity = Math.abs(distance / duration);
          let acceleration = velocity / duration * 400;
          if (duration < 1000 && velocity > 0.5) {
            this.scrollToTop(thisElm, thisElm.scrollTop + acceleration * distance, this.frameHeight * acceleration / this.fpa)
          }
          this.direction = 0;
          event.stopPropagation();
        }
      })
    }
  }

  activeTab(tab: number) {
    if (tab == 2) this.activeTab2 = true;
    if (tab == 3) { this.activeTab3 = true; this.activeTab2 = true }
    if (this.requestId != null && this.requestId != undefined) cancelAnimationFrame(this.requestId);
    this.scrollLeft = this.tabContent.scrollLeft;
    let acceleration = Math.abs(this.currentTab - tab);
    if (acceleration == 0) acceleration = 1;
    this.currentTab = tab;
    this.holdDirection = 2;
    this.scrollToLeft((tab - 1) * this.frameWidth, acceleration * this.frameWidth / this.fpa, acceleration * 100 / this.numTabs / this.fpa);
    this.setClassActive();
  }

  scrollToLeft(left: number, delta: number, highlightDelta: number) {
    this.scrollLeft = this.tabContent.scrollLeft;
    let highlightPosition = (left / this.frameWidth) * 100 / this.numTabs; //unit %

    if (this.scrollLeft < left - delta) {
      this.tabContent.scrollLeft += delta;
      this.tabHighLight.style.left = (this.tabHighLight.offsetLeft / this.frameWidth * 100 + highlightDelta) + "%";
      this
      this.requestId = window.requestAnimationFrame(() => this.scrollToLeft(left, delta, highlightDelta));
    } else {
      if (this.scrollLeft > left + delta) {
        this.tabContent.scrollLeft -= delta;
        this.tabHighLight.style.left = (this.tabHighLight.offsetLeft / this.frameWidth * 100 - highlightDelta) + "%";
        this.requestId = window.requestAnimationFrame(() => this.scrollToLeft(left, delta, highlightDelta));
      } else {
        this.tabContent.scrollLeft = left;
        this.tabHighLight.style.left = highlightPosition + '%';
        this.holdDirection = 0;
      }
    }
  }

  scrollToTop(elm: HTMLElement, top: number, delta: number) {
    cancelAnimationFrame(this.requestId);
    let scrollTop: number = elm.scrollTop;
    if (scrollTop + delta < top) {
      elm.scrollTop = scrollTop + delta;
      this.requestId = window.requestAnimationFrame(() => this.scrollToTop(elm, top, delta));
    } else {
      if (scrollTop - delta > top) {
        elm.scrollTop = scrollTop - delta;
        this.requestId = window.requestAnimationFrame(() => this.scrollToTop(elm, top, delta));
      } else {
        elm.scrollTop = top;
      }
    }
  }

  setClassActive() {
    var tabItems = document.getElementsByClassName("tap-item");
    for (var i = 0; i < tabItems.length; i++) {
      tabItems[i].classList.remove('active');
    }

    switch (this.currentTab) {
      case 1: { document.getElementById('tab-home').classList.add('active'); break; }
      case 2: { document.getElementById('tab-feed').classList.add('active'); break; }
      case 3: { document.getElementById('tab-profile').classList.add('active'); break; }
      case 4: { document.getElementById('tab-other').classList.add('active'); break; }
      default: { document.getElementById('tab-home').classList.add('active'); }
    }
  }

  //End custom tab function

  showToast(message: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: "top"
    })
    toast.present();
  }

  //Run first 
  ionViewDidEnter() {
    console.log("HomePage ionViewDidEnter")
    this.refresh();
  }
  refresh() {
    this.storage.ready().then(() => {
      this.checkinProvider.localGetCheckinStatus().then((localData) => {
        if (localData != null && this.currentDate == localData.today) {
          //Exists data in local and data is up to date  
          this.checkinData = localData;
          if (this.checkinData.checkInTime > 0) {
            this.showCheckinStatus(1);
          }
          if (this.checkinData.checkOutTime > 0) {
            this.showCheckoutStatus(1);
          }
          console.log("Exists local data: ", localData);
        } else {
          console.log("Not exists local data");
        }

        this.checkinProvider.serverGetCheckinStatus(this.currentDate).then(
          (data) => {
            let body = JSON.parse(data._body);
            if (body.code == 1) {
              //No data in server
              this.checkinData.checkInTime = 0;
              this.checkinData.checkOutTime = 0;
              this.checkinData.today = "";
              this.storage.set("todayCheckedin", this.checkinData);
              this.showCheckinStatus(4);
              this.showCheckoutStatus(4);
            } else {
              //Existing data in server
              this.checkinData.checkInTime = body.checkInTime;
              this.checkinData.checkOutTime = body.checkOutTime;
              this.checkinData.today = this.currentDate;
              if (body.checkInTime > 0) this.showCheckinStatus(1);
              if (body.checkOutTime > 0) this.showCheckoutStatus(1);
              //store in to local
              this.storage.set("todayCheckedin", this.checkinData);
              console.log("Data update successfully", data);
            }
          }, (error) => {
            this.showToast("Could not connect to server. Please check the internet. ", 5000);
            console.log("Could not connect to server. Please check the internet. " + error);
          }
        )
      })
    })
  }
  showCheckinStatus(mode: number) {
    switch (mode) {
      case 1: {
        //Checked in
        this.checkinClass = "progress-primary";
        this.checkinProgress = 100;
        this.checkinText = "<span>Checked in <i class=\"fa fa-check-circle\"></i></span>";
        return;
      }
      case 2: {
        //Checking ...
        this.checkinClass = "progress-secondary";
        this.checkinText = "<span>Checking ...</span>";
        return;
      }
      case 3: {
        //Failed
        this.checkinClass = "progress-danger";
        this.checkinProgress = 100;
        this.checkinText = "<span>Failed <i class=\"fa fa-exclamation-circle\"></i></span>";
        return;
      }
      default: {
        //Not yet
        this.checkinClass = "progress-default";
        this.checkinProgress = 0;
        this.checkinText = "<span>Not Yet!</span>";
        return;
      }
    }
  }
  showCheckoutStatus(mode: number) {
    switch (mode) {
      case 1: {
        //Checked in
        this.checkoutClass = "progress-primary";
        this.checkoutProgress = 100;
        this.checkoutText = "<span>Checked out <i class=\"fa fa-check-circle\"></i></span>";
        return;
      }
      case 2: {
        //Checking ...
        this.checkoutClass = "progress-secondary";
        this.checkoutText = "<span>Checking ...</span>";
        return;
      }
      case 3: {
        //Failed
        this.checkoutClass = "progress-danger";
        this.checkoutProgress = 100;
        this.checkoutText = "<span>Failed <i class=\"fa fa-exclamation-circle\"></i></span>";
        return;
      }
      default: {
        //Not yet
        this.checkoutClass = "progress-default";
        this.checkoutProgress = 0;
        this.checkoutText = "<span>Pending ...</span>";
        return;
      }
    }
  }
  doCheckin() {
    this.showCheckinStatus(2);
    this.checkinProgress = 0;
    let progressTimeout1 = setTimeout(() => { this.checkinProgress = 60 }, 2000);
    let progressTimeout2 = setTimeout(() => { this.checkinProgress = 80 }, 5000);
    WifiWizard.getCurrentSSID((e) => {
      console.log("getCurrentSSID success", e);
      this.checkinProvider.serverCheckin(e).then((res) => {
        clearTimeout(progressTimeout1);
        clearTimeout(progressTimeout2);
        let body = JSON.parse(res._body);
        switch (body.code) {
          case 1: {
            //Checked in successfully
            //Do same as case 2
          }
          case 2: {
            //Already checked in
            this.showCheckinStatus(1);
            this.checkinData.checkInTime = body.checkInTime;
            this.checkinData.today = body.today;
            //Sotore data to local
            this.storage.set("todayCheckedin", this.checkinData);
            console.log("Checked in successfully");
            console.log("Checkin progress", this.checkinProgress);
            break;
          }
          case 3: {
            //User does not belong company
            this.showCheckinStatus(3);
            this.showToast("User does not belong company", 5000);
            console.log("User does not belong company");
            break;
          }
          case 4: {
            //Invalid macid
            this.showCheckinStatus(3);
            this.showToast("You have to use company's wifi to checkin. Your company wifi name: " + body.validWifi, 5000);
            console.log("Invalid macid");
            console.log("User macid: ", e);
            console.log("Valid wifi: ", body.validWifi);
            break;
          }
          default: {
            console.log(body.code);
            this.showCheckinStatus(4);
            setTimeout(this.refresh, 2000);
          }
        }
      }, (error) => {
        console.log("Could not connect to server. Please check the internet. " + error);
        this.showToast("Could not connect to server. Please check the internet.", 5000);
        this.showCheckinStatus(3);
        clearTimeout(progressTimeout1);
        clearTimeout(progressTimeout2);
        setTimeout(this.refresh, 2000);
      })

    }, (e) => {
      console.log("getCurrentSSID Fail");
      this.showToast("Wifi is not enabled", 5000);
      this.showCheckinStatus(3);
      clearTimeout(progressTimeout1);
      clearTimeout(progressTimeout2);
      this.refresh();
    });
  }

  doCheckout() {
    this.showCheckoutStatus(2);
    this.checkoutProgress = 0;
    let progressTimeout1 = setTimeout(() => { this.checkoutProgress = 60 }, 2000);
    let progressTimeout2 = setTimeout(() => { this.checkoutProgress = 80 }, 5000);
    WifiWizard.getCurrentSSID((e) => {
      console.log("getCurrentSSID success", e);
      this.checkinProvider.serverCheckout(e).then((res) => {
        clearTimeout(progressTimeout1);
        clearTimeout(progressTimeout2);
        let body = JSON.parse(res._body);
        switch (body.code) {
          case 1: {
            //Checked out successfully            
            //OR Already checked out
            this.showCheckoutStatus(1);
            this.checkinData.checkOutTime = body.checkoutTime;
            this.checkinData.today = body.today;
            //Sotore data to local
            this.storage.set("todayCheckedin", this.checkinData);
            console.log("Checked out successfully");
            break;
          }
          case 2: {
            //Have not checked in yet or User does not belong company
            this.showCheckoutStatus(3);
            this.showToast(body.message, 5000);
            console.log("User does not belong company", body);
            setTimeout(this.showCheckoutStatus(4), 5000);
            break;
          }
          case 3: {
            //Invalid macid
            this.showCheckoutStatus(3);
            this.showToast("You have to use company's wifi to checkin. Your company wifi name: " + body.validWifi, 5000);
            console.log("Invalid macid");
            console.log("User macid: ", e);
            console.log("Valid wifi: ", body.validWifi);
            break;
          }
          default: {
            console.log(body.code);
            this.showCheckoutStatus(4);
            setTimeout(this.refresh, 2000);
          }
        }
      }, (error) => {
        console.log("Could not connect to server. Please check the internet. " + error);
        this.showToast("Could not connect to server. Please check the internet.", 5000);
        this.showCheckoutStatus(3);
        clearTimeout(progressTimeout1);
        clearTimeout(progressTimeout2);
        setTimeout(this.refresh, 2000);
      })

    }, (e) => {
      console.log("getCurrentSSID Fail");
      this.showToast("Wifi is not enabled", 5000);
      this.showCheckinStatus(3);
      clearTimeout(progressTimeout1);
      clearTimeout(progressTimeout2);
      this.refresh();
    });
  }

  gotoCheckinHistory() {
    this.navCtrl.push(HistoryPage);
  }

  //Products function
  showConfirm(food: any) {
    this.currentFood = food;
    let confirm = this.alertCtrl.create({
      title: "Do you want to order '" + this.currentFood.value.name + "'?",
      message: this.currentFood.value.details,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.presentToast();
          }
        }
      ]
    });
    confirm.present();
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Order successfully',
      duration: 1500,
      position: 'top'
    });

    toast.present();
  }

  // test() {
  //   this.checkinProvider.serverGetProducts().then((res) => {
  //     let body = JSON.parse(res._body);
  //     let m: string[]
  //     this.foods = this.transform(body, m);
  //   }, (rej) => {
  //     console.log("connect failed");
  //   })
  // }

  // change from objects to array
  transform(value, args: string[]): any {
    let keys = [];
    for (let key in value) {
      keys.push({ key: key, value: value[key] });
    }
    return keys;
  }
  goToAboutPage() {
    this.navCtrl.push(AboutPage);
  }

  logout() {
    GooglePlus.logout();
    Facebook.logout();
    this.storage.set("isLoggedIn", false);
    this.navCtrl.setRoot(LoginPage);
  }
}

import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { CheckinProvider } from '../../providers/checkin-provider';
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
  currentMonth = ""; //Month show to user
  dateHtml = ""; //Html for date
  selectedMonth = 2; //Month user select
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  numDaysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  onTimeDays = 0;
  outTimeDays = 0;
  noDataDay = 0;
  checkinData = [];
  constructor(private elRef: ElementRef, public navCtrl: NavController, public navParams: NavParams, public checkinProvider: CheckinProvider, public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {

  }
  ionViewDidEnter() {
    console.log('ionViewDidLoad HistoryPage');
    let date = new Date();
    this.selectedMonth = date.getMonth();
    this.generateDateHtml();
  }

  generateDateHtml() {
    this.onTimeDays = 0;
    this.outTimeDays = 0;
    this.noDataDay = 0;
    this.currentMonth = this.months[this.selectedMonth].toString() + " - 2017";
    // this.dateHtml = "";
    let startDay = new Date("" + this.months[this.selectedMonth] + " 01, 2017 08:00:00").getDay();//Day of the weed index from 1
    this.checkinData = [];
    for (let i = 1; i < startDay; i++) {
      this.checkinData.push({});
    }
    for (let i = 1; i <= this.numDaysOfMonth[this.selectedMonth]; i++) {
      this.checkinData.push({ "checkInDay": i });
    }
    let startTime = new Date("" + this.months[this.selectedMonth] + " 01, 2017 00:00:00").getTime();
    let endTime = new Date("" + this.months[this.selectedMonth] + " " + this.numDaysOfMonth[this.selectedMonth] + ", 2017 23:59:59").getTime();
    this.checkinProvider.serverGetCheckinHistory(startTime, endTime).then((data) => {
      let history = JSON.parse(data._body);
      console.log("history: ", history);
      if (history == null || history == undefined) return;
      // this.dateHtml = "";
      this.checkinData = [];
      for (let i = 1; i < startDay; i++) {
        this.checkinData.push({});
      }

      let cursorDay = 1;//Day of the month. Index from 1
      let endDay = this.numDaysOfMonth[this.selectedMonth];
      let historyArray = [];
      Object.keys(history).forEach((key) => {
        console.log("key", key);
        historyArray.push(history[key])
      })
      historyArray.sort((a, b) => {
        return a.checkInTime - b.checkInTime;
      })
      console.log("array", historyArray);
      historyArray.forEach((element) => {
        if (element["isOntime"]) {
          this.onTimeDays++;
        } else {
          this.outTimeDays++;
        }
        let checkintime = new Date(element["checkInTime"]);
        let checkinDay = checkintime.getDate();
        if (checkinDay < cursorDay) return;
        while (cursorDay < checkinDay) {
          this.checkinData.push({ "checkInDay": cursorDay });
          cursorDay++;
        }
        if (cursorDay == checkinDay) {
          // this.dateHtml += "<div class=\"date" + (element["isOntime"] ? " on-time" : " out-time") + "\"><span>" + cursorDay + "</span></div>"
          this.checkinData.push({
            "checkInDay": cursorDay,
            "checkInTime": element["checkInTime"],
            "checkOutTime": element["checkOutTime"],
            "isOntime": element["isOntime"],
            "class": element["isOntime"] ? "on-time" : "out-time"
          });
          cursorDay++;
        }
        return;
      })
      while (cursorDay <= endDay) {
        // this.dateHtml += "<div class=\"date\"><span>" + cursorDay + "</span></div>";
        this.checkinData.push({ "checkInDay": cursorDay });
        cursorDay++;
      }
      this.noDataDay = endDay - this.onTimeDays - this.outTimeDays;
    }, (error) => {
      console.log("error");
    });

  }
  nextMonth() {
    if (this.selectedMonth < 11) this.selectedMonth++;
    this.generateDateHtml();
  }
  prevMonth() {
    if (this.selectedMonth > 0) this.selectedMonth--;
    this.generateDateHtml();
  }

  showCheckinDetail(checkInDay: number, checkInTime: number, checkOutTime: number, isOnTime: boolean) {

    if (checkInTime != null && checkInTime != undefined) {
      let selectDay = this.months[this.selectedMonth] + " " + checkInDay + ", 2017";
      let date = new Date(checkInTime);
      let message = "";
      if (checkInTime > 0)
        message += "Checkin time: " + this.getTwoDigitNumber(date.getHours()) + ":" + this.getTwoDigitNumber(date.getMinutes()) + ":" + this.getTwoDigitNumber(date.getSeconds()) + "<br/>";
      date = new Date(checkOutTime);
      if (checkOutTime > 0)
        message += "Checkout time: " + this.getTwoDigitNumber(date.getHours()) + ":" + this.getTwoDigitNumber(date.getMinutes()) + ":" + this.getTwoDigitNumber(date.getSeconds()) + "<br/>";
      else
        message += "Checkout time: NOT checked out";
      this.showAlert(selectDay, message);
    }
  }
  showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  getTwoDigitNumber(num: number) {
    if (num < 10) return "0" + num;
    return num.toString();
  }
}

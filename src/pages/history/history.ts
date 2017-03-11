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
  currentMonth = ""; //Month show to user
  dateHtml = ""; //Html for date
  selectedMonth = 2; //Month user select
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  numDaysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  onTimeDays = 0;
  outTimeDays = 0;
  noDataDay = 0;
  checkinData = [
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Wen, 01 Feb 2017 08:21:00'),
      "checkOutTime": Date.parse('Wen, 01 Feb 2017 18:16:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Thu, 02 Feb 2017 08:16:00'),
      "checkOutTime": Date.parse('Thu, 02 Feb 2017 17:49:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Fri, 03 Feb 2017 08:31:00'),
      "checkOutTime": Date.parse('Fri, 03 Feb 2017 17:36:00'),
      "isOntime": false
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Mon, 06 Feb 2017 08:10:00'),
      "checkOutTime": Date.parse('Mon, 06 Feb 2017 18:16:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Tue, 07 Feb 2017 08:22:00'),
      "checkOutTime": Date.parse('Tue, 07 Feb 2017 17:39:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Wen, 08 Feb 2017 08:13:00'),
      "checkOutTime": Date.parse('Wen, 01 Feb 2017 17:59:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Thu, 09 Feb 2017 08:19:00'),
      "checkOutTime": Date.parse('Thu, 09 Feb 2017 18:21:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Fri, 10 Feb 2017 08:26:00'),
      "checkOutTime": Date.parse('Fri, 10 Feb 2017 17:47:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Mon, 13 Feb 2017 08:25:00'),
      "checkOutTime": Date.parse('Mon, 13 Feb 2017 18:49:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Tue, 14 Feb 2017 09:03:00'),
      "checkOutTime": Date.parse('Tue, 14 Feb 2017 17:39:00'),
      "isOntime": false
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Wen, 15 Feb 2017 08:36:00'),
      "checkOutTime": Date.parse('Wen, 15 Feb 2017 18:12:00'),
      "isOntime": false
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Thu, 16 Feb 2017 08:20:00'),
      "checkOutTime": Date.parse('Thu, 16 Feb 2017 19:01:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Fri, 17 Feb 2017 08:17:00'),
      "checkOutTime": Date.parse('Fri, 17 Feb 2017 17:55:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Mon, 20 Feb 2017 08:22:00'),
      "checkOutTime": Date.parse('Mon, 20 Feb 2017 17:36:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Tue, 21 Feb 2017 08:21:00'),
      "checkOutTime": Date.parse('Tue, 21 Feb 2017 18:06:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Wen, 22 Feb 2017 08:26:00'),
      "checkOutTime": Date.parse('Wen, 22 Feb 2017 18:51:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Thu, 23 Feb 2017 08:23:00'),
      "checkOutTime": Date.parse('Thu, 23 Feb 2017 18:35:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Fri, 24 Feb 2017 08:32:00'),
      "checkOutTime": Date.parse('Fri, 24 Feb 2017 18:16:00'),
      "isOntime": false
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Mon, 27 Feb 2017 08:18:00'),
      "checkOutTime": Date.parse('Mon, 27 Feb 2017 18:06:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Tue, 28 Feb 2017 08:09:00'),
      "checkOutTime": Date.parse('Tue, 28 Feb 2017 17:53:00'),
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": 1488511689819,
      "checkOutTime": 0,
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Mon, 06 Mar 2017 09:00:00'),
      "checkOutTime": 0,
      "isOntime": false
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Tue, 07 Mar 2017 08:30:00'),
      "checkOutTime": 0,
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Wen, 08 Mar 2017 07:30:00'),
      "checkOutTime": 0,
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Thu, 09 Mar 2017 07:40:00'),
      "checkOutTime": 0,
      "isOntime": true
    },
    {
      "checkinPlace": "bGateCorp",
      "checkInTime": Date.parse('Fri, 10 Mar 2017 09:00:00'),
      "checkOutTime": 0,
      "isOntime": false
    }
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let date = new Date();
    this.currentMonth = this.months[date.getMonth()].toString() + " - " + date.getFullYear();
    for (let i = 1; i <= 35; i++) {
      this.dateHtml += "<div class=\"date\"></div>";
    }
    this.generateDateHtml();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

  generateDateHtml() {
    this.dateHtml = "";
    let startDay = new Date("" + this.months[this.selectedMonth] + " 01, 2017 08:00:00").getDay();//Day of the weed index from 1
    console.log("startDay", startDay);
    for (let i = 1; i < startDay; i++) {
      this.dateHtml += "<div class=\"date\"></div>";
    }
    let cursorDay = 1;//Day of the month. Index from 1
    let endDay = this.numDaysOfMonth[this.selectedMonth];
    this.checkinData.forEach((element) => {
      let dateClass = " ";
      if (element["isOntime"]) {
        this.onTimeDays++;
        dateClass = " on-time";
      } else {
        this.outTimeDays++;
        dateClass = " out-time";
      }
      if (cursorDay != 1) cursorDay++;
      console.log("element", element);
      console.log("cursorDay", cursorDay);
      let checkintime = new Date(element["checkInTime"]);
      let checkinDay = checkintime.getDate();
      if (checkinDay < cursorDay) return;
      while (cursorDay < checkinDay) {
        this.dateHtml += "<div class=\"date\"><span>" + cursorDay + "</span></div>";
        cursorDay++;
      }
      if (cursorDay == checkinDay) {
        this.dateHtml += "<div class=\"date" + (element["isOntime"] ? " on-time" : " out-time") + "\"><span>" + cursorDay + "</span></div>"
      }
      console.log("isOnTime", element["isOnTime"]);
      console.log("checkInTime", element["checkInTime"]);
      return;
    });
    if (cursorDay != 1) cursorDay++;
    while (cursorDay <= endDay) {
      this.dateHtml += "<div class=\"date\"><span>" + cursorDay + "</span></div>";
      cursorDay++;
    }
    this.noDataDay = endDay - this.onTimeDays - this.outTimeDays;
  }

}

import { Component } from '@angular/core';
import { NavController, NavParams, ItemSliding, Item, AlertController } from 'ionic-angular';

/*
  Generated class for the ManageEmployee page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-manage-employee',
  templateUrl: 'manage-employee.html'
})
export class ManageEmployeePage {
  employees = ["Jack", "Jonh", "Cena"];
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageEmployeePage');
  }

  public open(itemSlide: ItemSliding, item: Item) {
    itemSlide.setElementClass("active-sliding", true);
    itemSlide.setElementClass("active-slide", true);
    itemSlide.setElementClass("active-options-right", true);
    item.setElementStyle("transform", "translate3d(-141px, 0px, 0px)");

    // itemSlide.close();
  }
  public showAddEmployeeAlert() {
    let prompt = this.alertCtrl.create({
      title: 'Add new employee', 
      inputs: [
        {
          name: 'employee id',
          placeholder: 'Employee id'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

}

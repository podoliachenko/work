import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import moment from 'moment';
import {CalendarService} from "../../app/calendar.service";
import {SettingService} from "../../app/setting.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mmt = moment;

  constructor(public navCtrl: NavController, public calendar: CalendarService, public  setting: SettingService) {
    moment.locale('ru');
  }
}

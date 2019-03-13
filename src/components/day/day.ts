import {Component, Input} from '@angular/core';
import * as moment from "moment";
import {CalendarService} from "../../app/calendar.service";
import {AlertController} from "ionic-angular";
import {SettingService} from "../../app/setting.service";

/**
 * Generated class for the DayComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'day',
  templateUrl: 'day.html'
})
export class DayComponent {

  @Input('day') day: moment.Moment;

  constructor(public service: CalendarService, public alertCtrl: AlertController, private setting: SettingService) {
  }

  freeday() {
    return this.day.isoWeekday() === 7 || this.day.isoWeekday() === 6;
  }

  notInMonth() {
    return this.day.month() !== this.service.selectedDay.month();
  }

  workDay() {
    return this.service.calculateWorkDay(this.day);
  }

  currentDay() {
    return this.day.format('DD.MM.YYYY') === moment().format('DD.MM.YYYY');
  }

  workHours() {
    return this.setting.worked ? !!this.setting.worked[this.day.format('DD.MM.YYYY')] : false;
  }

  openAlert() {
    this.alertCtrl.create({
      title: 'Количество отработанных дней',
      message: this.day.format('DD MMMM YYYY'),
      inputs: [
        {
          name: 'hours',
          placeholder: 'Часов',
          value: this.setting.worked[this.day.format('DD.MM.YYYY')] ? this.setting.numberToTime(this.setting.worked[this.day.format('DD.MM.YYYY')]) : null,
          type: 'time'
        },
      ],
      buttons: [
        {
          text: 'Удалить',
          handler: data => {
            this.setting.setWorkHours(this.day.format('DD.MM.YYYY'), 0)
          }
        },
        {
          text: 'Отменить'
        },
        {
          text: 'Сохранить',
          handler: data => {
            this.setting.setWorkHours(this.day.format('DD.MM.YYYY'), data.hours)
          }
        }
      ]
    }).present();
  }
}

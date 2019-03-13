import {Injectable} from "@angular/core";
import moment from "moment";
import {SettingService} from "./setting.service";
import {AlertController} from "ionic-angular";


@Injectable()
export class CalendarService {

  currentDay: moment.Moment;
  selectedDay: moment.Moment;

  get currentMonth() {
    return this.selectedDay.month() | 0;
  }

  set currentMonth(val) {
    this.selectedDay.month(val);
  }

  constructor(private setting: SettingService, private alertCtrl: AlertController) {
    moment.locale('ru')
    this.currentDay = moment();
    this.selectedDay = moment();
  }

  nextMonth() {
    this.selectedDay.month(this.selectedDay.month() + 1)
  }

  prevMonth() {
    this.selectedDay.month(this.selectedDay.month() - 1)
  }

  days() {
    const d = this.selectedDay.daysInMonth();
    const ds = [];
    let mdm = moment(this.selectedDay).date(1).isoWeekday() - 1;
    for (let i = 0; i < mdm; i++) {
      ds.unshift(moment(this.selectedDay).date(1).subtract(i + 1, 'day'))
    }
    for (let i = 0; i < d; i++) {
      ds.push(moment(this.selectedDay).date(i + 1))
    }
    mdm = Math.abs(moment(this.selectedDay).date(this.selectedDay.daysInMonth()).isoWeekday() - 7);
    for (let i = 0; i < mdm; i++) {
      ds.push(moment(this.selectedDay).date(this.selectedDay.daysInMonth()).add(i + 1, "day"))
    }
    return ds;
  }

  selectDay(moment: moment.Moment) {
    this.selectedDay = moment;
  }

  equalsSelected() {
    return this.currentDay.format('DD.MM.YYYY') === this.selectedDay.format('DD.MM.YYYY');
  }

  calculateWorkDay(day) {
    const worked = new Array(this.setting.workday);
    worked.fill(1)
    const work = Math.round(day.unix() / 60 / 60 / 24 - this.setting.offset);
    return !!worked[work % (this.setting.workday + this.setting.freeday)];
  }

  calculateWorked() {
    if (this.setting.worked) {
      const d = moment(this.selectedDay).date(1);
      let hours = 0;
      while (d.month() === this.selectedDay.month()) {
        const v = this.setting.workPipe(d.format('DD.MM.YYYY'));
        if (v) {
          hours += v;
        }
        d.add(1, 'day');
      }
      return hours;
    }
    return 0;
  }

  setNeedWork() {
    this.alertCtrl.create({
      title: `Нужно отработать за ${this.selectedDay.format('MMMM YYYY')}`,
      inputs: [
        {
          name: 'hours',
          placeholder: 'Часов',
          value: this.setting.needWork[this.selectedDay.format('MM.YYYY')] ? this.setting.needWork[this.selectedDay.format('MM.YYYY')] : null,
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Удалить',
          handler: data => {
            this.setting.setNeedWork(this.selectedDay.format('MM.YYYY'), 0)
          }
        },
        {
          text: 'Отменить'
        },
        {
          text: 'Сохранить',
          handler: data => {
            this.setting.setNeedWork(this.selectedDay.format('MM.YYYY'), Number(data.hours))
          }
        }
      ]
    }).present();
  }

  needWork() {
    if (this.setting.needWork) {
      return this.setting.needWork[this.selectedDay.format('MM.YYYY')] ? this.setting.needWork[this.selectedDay.format('MM.YYYY')] : 0;
    } else {
      return 0;
    }
  }

  statusWork() {
    if (this.setting.needWork) {
      const work = this.calculateWorked();
      const need = this.setting.needWork[this.selectedDay.format('MM.YYYY')] ? this.setting.needWork[this.selectedDay.format('MM.YYYY')] : 0;
      if (need === 0) {
        return 'скольно нужно отработать?'
      } else if (work - need < 0) {
        return `осталось ${this.setting.numberToTime(need - work)}`;
      } else if (work - need > 0) {
        return `переработка ${this.setting.numberToTime(work - need)}`;
      } else if (work - need === 0) {
        return 'месяц отработан'
      }
    }
    return '';
  }
}

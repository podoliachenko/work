import {Injectable} from "@angular/core";
import {Storage} from "@ionic/storage"

@Injectable()
export class SettingService {

  freeday: number;
  workday: number;
  offset: number;

  worked: any;
  needWork: any;

  constructor(private storage: Storage) {
    this.storage.get('freeday').then(value => {
      console.log(value, value | 3)
      this.freeday = value ? value : 3;
    })
    this.storage.get('workday').then(value => {
      this.workday = value ? value : 1;
    })
    this.storage.get('offset').then(value => {
      this.offset = value ? value : 0;
    })
    this.storage.get('worked').then(value => {
      this.worked = value ? value : {};
    })
    this.storage.get('needWork').then(value => {
      this.needWork = value ? value : {};
    })
  }

  offsetIncrease() {
    this.offset++;
    this.storage.set('offset', this.offset);
  }

  offsetReduce() {
    this.offset--;
    this.storage.set('offset', this.offset);
  }

  freedayIncrease() {
    this.freeday++;
    this.storage.set('freeday', this.freeday);
  }

  freedayReduce() {
    this.freeday--;
    this.storage.set('freeday', this.freeday);
  }

  workdayIncrease() {
    this.workday++;
    this.storage.set('workday', this.workday);
  }

  workdayReduce() {
    this.workday--;
    this.storage.set('workday', this.workday);
  }

  setWorkHours(date: string, count: any) {
    if (count !== 0) {
      this.worked[date] = count;
    } else {
      delete this.worked[date];
    }
    this.storage.set('worked', this.worked)
  }

  setNeedWork(date: string, count: number) {
    if (count > 0) {
      this.needWork[date] = count;
    } else {
      delete this.needWork[date];
    }
    this.storage.set('needWork', this.needWork)
  }

  workPipe(date) {
    if (typeof this.worked[date] === 'number') {
      return this.worked[date];
    } else if (typeof this.worked[date] === 'string') {
      const a = this.worked[date].split(':');
      return Number(a[0]) + (1 / 60 * Number(a[1]))
    }
    return 0;
  }

  numberToTime(date) {
    if (typeof date === 'string') {
      return date;
    } else if (typeof date === 'number') {
      const w = date;
      return `${this.zeroAdd(Math.trunc(w))} часа ${this.zeroAdd(Math.round(60 * ( w % (Math.trunc(w) !== 0 ? Math.trunc(w) : 1))))} минут`
    }
    return '00:00';
  }

  zeroAdd(value) {
    if (value.toString().length === 1) {
      return '0' + value.toString();
    } else {
      return value.toString();
    }
  }
}

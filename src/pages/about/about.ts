import { Component } from '@angular/core';
import {SettingService} from "../../app/setting.service";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public setting: SettingService) {

  }

}

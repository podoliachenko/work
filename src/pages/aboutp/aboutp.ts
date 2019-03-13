import { Component } from '@angular/core';
import {SettingService} from "../../app/setting.service";

@Component({
  selector: 'page-aboutp',
  templateUrl: 'aboutp.html'
})
export class AboutpPage {

  constructor(public setting: SettingService) {

  }


}

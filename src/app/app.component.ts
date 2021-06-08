import { Component, OnInit } from '@angular/core';

// Services
import { ElectronService } from './core/services/electron.service';
import { DialogsService } from './core/services/dialogs.service';
import { LoaderService } from './core/services/loader.service';
import { SettingService } from './core/services/setting.service';
import { TranslateService } from './core/services/translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private electronService: ElectronService,
    private dialogs: DialogsService,
    private loader: LoaderService,
    private setting: SettingService,
    private translate: TranslateService,
  ) {
    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit() {
    this.setting.init();
    this.translate.init();
    this.loader.init();

    if (this.setting.projects.length) {
      this.dialogs.openLatestProjects();
    }
  }
}

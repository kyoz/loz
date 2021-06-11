import { Component, OnInit } from '@angular/core';

// Services
import { ElectronService } from './core/services/electron.service';
import { DialogsService } from './core/services/dialogs.service';
import { LoaderService } from './core/services/loader.service';
import { ProjectsService } from './core/services/projects.service';
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
    private projects: ProjectsService,
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
    this.projects.init();
    this.setting.init();
    this.translate.init();
    this.loader.init();

    if (this.projects.projectList.length) {
      this.dialogs.openLatestProjects();
    }
  }
}

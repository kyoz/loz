import { Component, OnInit } from '@angular/core';

// Services
import { AppStateService } from './core/services/app-state.service';
import { DialogsService } from './core/services/dialogs.service';
import { ElectronService } from './core/services/electron.service';
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
    public projects: ProjectsService,
    public dialogs: DialogsService,
    private appState: AppStateService,
    private electron: ElectronService,
    private loader: LoaderService,
    private setting: SettingService,
    private translate: TranslateService,
  ) {
    if (electron.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electron.ipcRenderer);
      console.log('NodeJS childProcess', this.electron.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit() {
    this.projects.init();
    this.setting.init();
    this.translate.init();
    this.loader.init();

    this.initListeners();

    if (this.projects.projectList.length) {
      this.dialogs.openLatestProjects();
    }
  }

  ngAfterContentInit() {
    this.initListeners();
  }

  initListeners() {
    const cdkOverlayContainerEls = document.getElementsByClassName('cdk-overlay-container');
    const appState = this.appState;

    if (cdkOverlayContainerEls && cdkOverlayContainerEls[0]) {
      cdkOverlayContainerEls[0].addEventListener('contextmenu', function(ev) {
          ev.preventDefault();
          appState.onCdkOverlayRightClick$.next();
          return false;
      }, false);
    }
  }

  openUserGuide() {
    this.electron.shell.openExternal('https://github.com/kyoz/loz');
  }
}

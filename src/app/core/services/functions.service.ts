import { Injectable } from '@angular/core';
import { localeKeys } from '../constants/locales';
import * as moment from 'moment';

// Services
import { ElectronService } from './electron.service';
import { DataService } from './data.service';
import { DialogsService } from './dialogs.service';
import { LoaderService } from './loader.service';
import { LocaleParserService } from './locale-parser.service';
import { NotifyService } from './notify.service';
import { SettingService } from './setting.service';

@Injectable({providedIn: 'root'})
export class FunctionsService {

  localeNameRegex = new RegExp("[a-z]{2,3}(-[a-zA-Z015]{2,4})?(-[A-Z]{2,5})?.json");

  constructor(
    private electron: ElectronService,
    private data: DataService,
    private dialogs: DialogsService,
    private loader: LoaderService,
    private localeParser: LocaleParserService,
    private notify: NotifyService,
    private setting: SettingService,
  ) { }

  openI18nFolder(): void {
    this.electron.remote.dialog.showOpenDialog(
      this.electron.remote.getCurrentWindow(), 
      {
        title: 'Choose your i18n folder',
        message: 'Choose your i18n folder',
        properties: [
          'openDirectory'
        ]
      }
    ).then((res: any) => {
      if (!res || !res.filePaths || res.filePaths.length === 0) {
        return;
      }

      this.processI18nFolder(res.filePaths[0]);
    });
  }

  processI18nFolder(folderPath: string): void {
    const fileNames = this.electron.fs.readdirSync(folderPath);

    if (!fileNames || fileNames.length === 0) {
      alert('This is empty folder. init');
      return;
    }

    if (!this.isValidI18nFolder(fileNames)) {
      this.setting.removeProject(folderPath);
      this.notify.pushNotify('Not valid i18n folder');
      return;
    }

    const localeMap = [];

    try {
      const languages = [];

      for (const fileName of fileNames) {
        const locale = fileName.replace('.json', '');
        const localeData = JSON.parse(
          this.electron.fs.readFileSync(`${folderPath}/${fileName}`, {encoding: 'utf8'})
        );

        localeMap[locale] = localeData;
      }

      // Save project to storage for fast open next time
      this.setting.saveProject({
        path: folderPath,
        languages: Object.keys(localeMap) || [],
        primaryLanguage: '',
        lastModified: moment().unix(),
      });

      // Start parse data
      this.loader.show();

      // Delay a litle bit to ensure loader is displayed
      setTimeout(() => {
        this.data.tree$.next(this.localeParser.parseToTree(localeMap));

        this.loader.hide();

        // Check to ensure language & primary language is configurated
        if (!this.setting?.currentProject?.languages.length ||
            !this.setting?.currentProject?.primaryLanguage) {

          this.dialogs.openLanguagesConfig();
        }
      }, 200);
    } catch (e) {
      alert('Error when parsing i18n files.');
    }
  }

  save(silent = false) {
    if (!silent) {
      this.loader.show();
    }

    const languages = this.setting.languages$.value;
    const savePath = this.setting.currentProject.path;
    const results = {};

    // Remove locale that not exist in project
    const existFiles = this.electron.fs.readdirSync(savePath);

    for (const existFile of existFiles) {
      if (!languages.includes(existFile.replace('.json', ''))) {
        this.electron.fs.rmSync(`${savePath}/${existFile}`, {
          force: true,
        });
      }
    }

    // Parse and save file
    for (const language of languages) {
      const json = this.localeParser.parseTreeToJson(language);
      this.electron.fs.writeFileSync(`${savePath}/${language}.json`, json);
    }

    this.loader.hide();
  }

  private isValidI18nFolder(fileNames: string[]): boolean {
    for (const fileName of fileNames) {
      if (!this.isValidI18nFile(fileName)) {
        return false;
      }
    }

    return true;
  }

  private isValidI18nFile(fileName: string): boolean {
    return this.localeNameRegex.test(fileName) &&
      localeKeys.includes(fileName.replace('.json', ''));
  }
}

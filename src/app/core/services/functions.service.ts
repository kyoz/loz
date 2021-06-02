import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable({providedIn: 'root'})
export class FunctionsService {

  localeNameRegex = new RegExp("[a-z]{2,3}(-[a-zA-Z015]{2,4})?(-[A-Z]{2,5})?.json");

  constructor(
    private electron: ElectronService
  ) { }

  openI18nFolder() {
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

      this.afterOpenI18nFolder(res.filePaths[0]);
    });
  }

  private afterOpenI18nFolder(folderPath) {
    const fileNames = this.electron.fs.readdirSync(folderPath);

    if (!fileNames || fileNames.length === 0) {
      alert('This is empty folder. init');
      return;
    }

    if (!this.isValidI18nFolder(fileNames)) {
      alert('Not valid folder');
      return;
    }

    const localeMap = [];

    try {
      for (const fileName of fileNames) {
        const locale = fileName.replace('.json', '');
        const localeData = JSON.parse(
          this.electron.fs.readFileSync(`${folderPath}/${fileName}`, {encoding: 'utf8'})
        );

        localeMap[locale] = localeData;
      }

      console.log(localeMap);
    } catch (e) {
      alert('Error when parsing i18n files.');
    }
  }

  private isValidI18nFolder(fileNames: string[]) {
    for (const fileName of fileNames) {
      if (!this.isValidI18nFile(fileName)) {
        return false;
      }
    }

    return true;
  }

  private isValidI18nFile(fileName: string) {
    return this.localeNameRegex.test(fileName);
  }
}

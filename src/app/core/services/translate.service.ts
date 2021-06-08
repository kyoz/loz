import { Injectable } from '@angular/core';
import { TranslateService as NgxTranslate } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { STORAGE_LANG } from '../constants/storage-keys';

@Injectable({ providedIn: 'root' })
export class TranslateService {

  currentLanguage$ = new BehaviorSubject('vi');

  constructor(
    private ngxTranslate: NgxTranslate,
    private http: HttpClient
  ) { }

  init() {
    this.ngxTranslate.setDefaultLang('en');

    const lang = localStorage.getItem(STORAGE_LANG);

    if (lang) {
      this.currentLanguage$.next(lang);
      this.ngxTranslate.setDefaultLang(lang);
      this.ngxTranslate.use(lang);
    } else {
      this.changeLanguage('en');
    }
  }

  changeLanguage(lang: string) {
    switch (lang) {
      case 'en':
        localStorage.setItem(STORAGE_LANG, 'vi');
        this.ngxTranslate.use('vi');
        this.currentLanguage$.next('vi');
        break;
      default:
        localStorage.setItem(STORAGE_LANG, lang);
        this.ngxTranslate.use(lang);
        this.currentLanguage$.next('en');
    }
  }

  get(key: string, params: object = {}): Promise<string> {
    return this.ngxTranslate.get(key, params).toPromise();
  }
}

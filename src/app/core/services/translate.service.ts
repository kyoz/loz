import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService as NgxTranslate } from '@ngx-translate/core';

import { BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

    const language = localStorage.getItem(STORAGE_LANG);

    if (!language) {
      return this.setLanguage('en');
    }

    this.setLanguage(language);
    this.ngxTranslate.setDefaultLang(language);
  }

  changeLanguage(lang: string) {
    switch (lang) {
      case 'vi':
        this.setLanguage('vi');
        break;

      default:
        this.setLanguage('en');
        break;
    }
  }

  get(key: string, params: object = {}): Promise<string> {
    return this.ngxTranslate.get(key, params).toPromise();
  }

  private fetchLangugeFile(language: string) {
    return this.http.get(`/assets/i18n/${language}.json`).pipe(
      map(() => true),
      catchError(() => of(false))
    ).toPromise();
  }

  private setLanguage(language) {
    this.ngxTranslate.use(language);
    this.currentLanguage$.next(language);
    localStorage.setItem(STORAGE_LANG, language);
  }
}

import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LocaleUtilsService {

  localeRegex = new RegExp(/^[a-zA-Z0-9][\w-]*(?:\.[\w-]+)*$/)

  constructor() { }

  isValidLocaleKey(key: string) {
    return this.localeRegex.test(key);
  }

  genEmptyLocaleData(localeList: string[]) {
    const result = [];

    for (const locale of localeList) {
      result.push({
        locale,
        value: ''
      });
    }

    return result;
  }
}

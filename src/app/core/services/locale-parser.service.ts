import { Injectable } from '@angular/core';
import { Locale, LocaleValue } from '../interfaces';
import * as _ from 'lodash';

@Injectable({providedIn: 'root'})
export class LocaleParserService {

  constructor() { }

  parseToTree(localeData: Record<string, any>): Locale[] {
    const localeList = Object.keys(localeData);

    if (localeList.length === 0) {
      return undefined;
    }

    // Map to fill missing data before merge
    const mergedLocaleData = {};

    for (const locale of localeList) {
      const newLocaleData = _.cloneDeep(localeData[locale]);
      const parsedLocaleData = this.recursiveParseLocale(newLocaleData, locale, localeList);

      _.mergeWith(mergedLocaleData, parsedLocaleData, (objValue, srcValue) => {
        if (_.isString(objValue)) {
          return objValue.length === 0 ? srcValue : objValue;
        }
      });
    }

    return _.values(this.recursiveParseMaterialTree(mergedLocaleData));
  }
  
  private recursiveParseLocale(
    data: Record<string, any>,
    currentLocale: string,
    localeList: string[]
  ) {
    for (const key in data) {
      switch(typeof data[key]) {
        case 'string':
          data[key] = this.genLocaleData(currentLocale, localeList, data[key]);
          break;
        case 'object':
          data[key] = this.recursiveParseLocale(data[key], currentLocale, localeList);
          break;
        default:
          data[key] = '';
      }
    }

    return data;
  }
  
  private recursiveParseMaterialTree(data: Record<string, any>): Locale[] {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key] = {
          key,
          path: '?',
          values: data[key],
          children: [],
        };

        continue;
      }

      data[key] = {
        key,
        path: '?',
        value: [],
        children: _.values(this.recursiveParseMaterialTree(data[key])),
      };
    }

    return data as Locale[];
  }

  private genLocaleData(currentLocale, localeList, value) {
    const result = [];

    for (const locale of localeList) {
      result.push({
        locale,
        value: currentLocale === locale? value : ''
      });
    }

    return result;
  }
}

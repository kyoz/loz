import { Injectable } from '@angular/core';
import { Locale } from '../interfaces';
import * as _ from 'lodash';

// Services
import { DataService } from './data.service';

@Injectable({providedIn: 'root'})
export class LocaleParserService {

  constructor(private data: DataService) { }

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

    // Now parse to material tree data and also gen data map
    this.data.dataMap = {};
    return _.orderBy(
      _.values(this.recursiveParseMaterialTree(mergedLocaleData)),
      ['key'], ['asc'],
    );
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
  
  private recursiveParseMaterialTree(
    data: Record<string, any>,
    parentPath: string = undefined
  ): Locale[] {
    for (const key in data) {
      const path = parentPath ? `${parentPath}.${key}` : key;

      if (Array.isArray(data[key])) {
        data[key] = {
          key,
          path,
          values: data[key],
          children: [],
        };

        // Also map global data
        this.data.dataMap[path] = {};

        for (const localeItem of data[key].values) {
          this.data.dataMap[path][localeItem.locale] = localeItem.value;
        }

        continue;
      }

      data[key] = {
        key,
        path,
        values: [],
        children: _.orderBy(
          _.values(this.recursiveParseMaterialTree(data[key], path)),
          ['key'], ['asc']
        ),
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

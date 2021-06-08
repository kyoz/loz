import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Locale } from '../interfaces';

@Injectable({providedIn: 'root'})
export class DataService {

  tree$ = new BehaviorSubject([]);

  currentNode$ = new BehaviorSubject(undefined);
  currentKeys$ = new BehaviorSubject([]);

  dataMap = {};

  constructor() {
    this.init();
  }

  init() {
    this.currentNode$.pipe(distinctUntilChanged()).subscribe(currentNode => {
      if (!currentNode) {
        return;
      }

      this.currentKeys$.next(this.recursiveParseKeys(currentNode));
    });
  }

  recursiveParseKeys(node: Locale) {
    const results = [];
    
    if (node.values.length > 0) {
      results.push(node.path);
    }

    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        results.push(...this.recursiveParseKeys(child));
      }
    }

    return results;
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Locale } from '../interfaces';

// Services
import { ProjectsService } from './projects.service';

@Injectable({providedIn: 'root'})
export class DataService {

  tree$ = new BehaviorSubject([]);

  currentNode$ = new BehaviorSubject(undefined);
  currentKeys$ = new BehaviorSubject([]);

  dataMap = {};

  constructor(
    private projects: ProjectsService,
  ) {
    this.init();
    this.initListeners();
  }

  init() {
    this.currentNode$.pipe(distinctUntilChanged()).subscribe(currentNode => {
      if (!currentNode) {
        return;
      }

      this.currentKeys$.next(this.recursiveParseKeys(currentNode));
    });
  }

  initListeners() {
    this.projects.currentProject$.subscribe(currentProject => {
      if (!currentProject) {
        this.reset();
      }
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

  reset() {
    this.tree$.next([]);
    this.currentNode$.next(undefined);
    this.currentKeys$.next(undefined);
    this.dataMap = {};
  }
}

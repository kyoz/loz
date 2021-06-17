import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Locale } from '../interfaces';
import * as _ from 'lodash';

// Services
import { ProjectsService } from './projects.service';
import { NotifyService } from './notify.service';
import { LocaleUtilsService } from './locale-utils.service';
import { SettingService } from './setting.service';

@Injectable({providedIn: 'root'})
export class DataService {

  tree$: BehaviorSubject<Locale[]> = new BehaviorSubject([]);
  expandNodeRequest$: BehaviorSubject<Locale> = new BehaviorSubject(undefined);

  currentNode$ = new BehaviorSubject(undefined);
  currentKeys$ = new BehaviorSubject([]);

  pathMap = {};
  dataMap = {};

  constructor(
    private projects: ProjectsService,
    private notify: NotifyService,
    private localeUtils: LocaleUtilsService,
    private setting: SettingService
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

  addId(id: string) {
    const tree = this.tree$.value;
    const keys = id.split('.');

    const newTree = _.orderBy(this.addIdRecursive(tree, keys), ['path'], ['asc'])
    this.tree$.next(newTree);

    // Update tree after created
    // this.tree$.next(tree);
    // console.log(tree);

    this.notify.pushNotify('Translation added succesfully');
  }

  private addIdRecursive(tree: Locale[], keys: string[], parentPath: string = '') {
    const currentKey = keys.shift();
    let currentNode = tree.find(d => d.key === currentKey);
    let isLeftNode = false;

    // Create node if it not exist
    if (!currentNode) {
      isLeftNode = true;

      currentNode = {
        key: currentKey,
        path: parentPath.length ? `${parentPath}.${currentKey}` : currentKey,
        values: [],
        children: [],
      };

      tree.push(currentNode);
    }

    // If it exist and not the leaf node, remove it data
    if (currentNode && keys.length > 0) {
      currentNode.values = [];

      // Also delete dataMap
      delete this.dataMap[currentNode.path];
    }

    // Also create pathMap
    this.pathMap[currentNode.path] = true;

    if (keys.length === 0) {
      currentNode.values = this.localeUtils.genEmptyLocaleData(this.setting.languages$.value);

      this.dataMap[currentNode.path] = {};

      for (const lang of this.setting.languages$.value) {
        this.dataMap[currentNode.path][lang] = '';
      }
    } else {
      currentNode.children =
        this.addIdRecursive(currentNode.children, keys, currentNode.path);
    }

    // Sort tree
    tree = _.orderBy(tree, ['path'], ['asc'])


    if (isLeftNode) {
      // Request for expand node
      this.expandNodeRequest$.next(currentNode);
    }

    return tree;
  }

  removeId(key: string) {

  }

  isExistedKey(keyPath: string): boolean {
    return this.pathMap[keyPath] === true;
  }


  reset() {
    this.tree$.next([]);
    this.currentNode$.next(undefined);
    this.currentKeys$.next(undefined);
    this.dataMap = {};
  }
}

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
import { DialogsService } from './dialogs.service';


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
    private setting: SettingService,
    private dialogs: DialogsService,
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

  removeSelectedId() {
    const currentNode = this.currentNode$.value;

    if (!currentNode) {
      this.notify.pushNotify('Please select a translation to remove');
      return;
    }

    if (currentNode.children.length > 0) {
      this.dialogs.openConfirmDialog(
        'Remove this translation?',
        'I sure hope you know what are you doing :D',
        'warn'
      ).subscribe((accept: boolean) => {
        if (accept === true) {
          this.removeNode(this.currentNode$.value);
        }
      });
      return;
    }

    this.removeNode(this.currentNode$.value);
  }

  private removeNode(node: Locale) {
    // Remove from tree
    const removeNodePath = node.path;
    let newTree = _.cloneDeep(this.tree$.value);
    newTree = this.recursiveRemoveNode(newTree, removeNodePath);

    // Remove mapped data
    delete this.dataMap[removeNodePath];
    delete this.pathMap[removeNodePath];

    for (const key in this.dataMap) {
      if (key.startsWith(`${removeNodePath}.`)) {
        delete(this.dataMap[key]);
      }
    }

    for (const key in this.pathMap) {
      if (key.startsWith(`${removeNodePath}.`)) {
        delete(this.pathMap[key]);
      }
    }

    this.tree$.next(newTree);
    this.currentNode$.next(undefined);
  }

  private recursiveRemoveNode(tree: Locale[], removeNodePath: string) {
    for (const node of tree) {
      if (node.path === removeNodePath) {
        return tree.filter(d => d.path !== removeNodePath);
      } else {
        if (node.children) {
          node.children = this.recursiveRemoveNode(node.children, removeNodePath);

          // Generate locale incase this become root node
          if (node.children.length === 0) {
            node.values = this.localeUtils.genEmptyLocaleData(this.setting.languages$.value);

            this.dataMap[node.path] = {};

            for (const lang of this.setting.languages$.value) {
              this.dataMap[node.path][lang] = '';
            }
          }
        }
      }
    }

    return tree;
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

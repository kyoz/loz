import { Injectable } from '@angular/core';
import { STORAGE_PROJECTS } from '../constants/storage-keys';
import { Project } from '../interfaces';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';


// Services
import { StorageService } from './storage.service';

@Injectable({providedIn: 'root'})
export class SettingService {
  projects: Project[] = [];
  currentProject: Project;

  primaryLanguage$ = new BehaviorSubject('');
  languages$ = new BehaviorSubject([]);

  constructor(
    private storage: StorageService,
  ) { }

  init() {
    const projects = this.storage.get(STORAGE_PROJECTS);

    if (projects) {
      this.projects = _.orderBy(projects, ['lastModified'], ['desc']);
    }
  }

  saveProject(project: Project) {
    const existedProject = this.projects.find(d => d.path === project.path);

    if (existedProject) {
      if (project.languages.length) {
        existedProject.languages = project.languages;
      }

      if (project.primaryLanguage) {
        existedProject.primaryLanguage = project.primaryLanguage;
      }

      if (project.indentFormat !== undefined && project.indentFormat !== undefined) {
        existedProject.indentFormat = project.indentFormat;
      } else {
        if (existedProject.indentFormat === undefined) {
          existedProject.indentFormat = '  ';
        }
      }

      if (project.autoSave !== undefined && project.autoSave !== undefined) {
        existedProject.autoSave = project.autoSave;
      } else {
        if (existedProject.autoSave === undefined) {
          existedProject.autoSave = true;
        }
      }

      existedProject.lastModified = moment().unix();

      this.currentProject = _.cloneDeep(existedProject);
    } else {

      this.projects.push(project);
      this.currentProject = _.cloneDeep(project);
    }


    // Set project current setting
    this.languages$.next(this.currentProject.languages);
    this.primaryLanguage$.next(this.currentProject.primaryLanguage);

    // Store to storage
    this.storage.set(STORAGE_PROJECTS, this.projects);
  }

  saveCurrentProject() {
    this.saveProject(this.currentProject);
  }

  removeProject(path: string) {
    this.storage.set(STORAGE_PROJECTS, this.projects.filter(d => d.path !== path));
  }
}

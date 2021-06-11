import { Injectable } from '@angular/core';
import { STORAGE_PROJECTS } from '../constants/storage-keys';
import { Project } from '../interfaces';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';

// Services
import { StorageService } from './storage.service';

@Injectable({providedIn: 'root'})
export class ProjectsService {
  projectList: Project[] = [];
  currentProject$: BehaviorSubject<Project> = new BehaviorSubject(undefined);

  constructor(
    private storage: StorageService,
  ) { }

  init() {
    const projects = this.storage.get(STORAGE_PROJECTS);

    if (projects) {
      this.projectList = _.orderBy(projects, ['lastModified'], ['desc']);
    }
  }

  saveProject(project: Project) {
    const existedProject = this.projectList.find(d => d.path === project.path);

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

      this.currentProject$.next(_.cloneDeep(existedProject));
    } else {

      this.projectList.push(project);
      this.currentProject$.next(_.cloneDeep(project));
    }

    // Store to storage
    this.storage.set(STORAGE_PROJECTS, this.projectList);
  }

  saveCurrentProject() {
    this.saveProject(this.currentProject$.value);
  }

  removeProject(path: string) {
    this.storage.set(STORAGE_PROJECTS, this.projectList.filter(d => d.path !== path));
  }
}

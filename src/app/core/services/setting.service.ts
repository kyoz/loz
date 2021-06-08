import { Injectable } from '@angular/core';
import { STORAGE_PROJECTS } from '../constants/storage-keys';
import { Project } from '../interfaces';
import * as moment from 'moment';
import * as _ from 'lodash';


// Services
import { StorageService } from './storage.service';

@Injectable({providedIn: 'root'})
export class SettingService {
  projects: Project[] = [];
  currentProject: Project;

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
        existedProject.languages = _.merge(existedProject.languages, project.languages);
      }

      if (project.primaryLanguage) {
        existedProject.primaryLanguage = project.primaryLanguage;
      }

      existedProject.lastModified = moment().unix();
      this.currentProject = _.cloneDeep(existedProject);
    } else {

      this.projects.push(project);
      this.currentProject = _.cloneDeep(project);
    }

    this.storage.set(STORAGE_PROJECTS, this.projects);
  }

  removeProject(path: string) {
    this.storage.set(STORAGE_PROJECTS, this.projects.filter(d => d.path !== path));
  }
}

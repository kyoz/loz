import { Injectable } from '@angular/core';
import { STORAGE_PROJECTS } from '../constants/storage-keys';
import { Project } from '../interfaces';


// Services
import { StorageService } from './storage.service';

@Injectable({providedIn: 'root'})
export class SettingService {
  projects: Project[] = [];

  languages = [];
  primaryLanguage = '';

  constructor(
    private storage: StorageService,
  ) { }

  init() {
    const projects = this.storage.get(STORAGE_PROJECTS);

    if (projects) {
      this.projects = projects;
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
    } else {
      this.projects.push(project);
    }

    this.storage.set(STORAGE_PROJECTS, this.projects);
  }

  removeProject(path: string) {
    this.storage.set(STORAGE_PROJECTS, this.projects.filter(d => d.path !== path));
  }
}

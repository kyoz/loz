import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../interfaces';

// Services
import { ProjectsService } from './projects.service';

@Injectable({providedIn: 'root'})
export class SettingService {
  isDarkTheme$ = new BehaviorSubject('');

  primaryLanguage$ = new BehaviorSubject('');
  languages$ = new BehaviorSubject([]);
  autoSave$ = new BehaviorSubject(false);
  indentFormat$ = new BehaviorSubject('  ');

  constructor(
    private projects: ProjectsService
  ) {
    this.initListeners();
  }

  init() {
    // Get global config from storage
  }

  initListeners() {
    this.projects.currentProject$.subscribe((currentProject: Project) => {
      if (currentProject === undefined) {
        this.reset();
        return;
      }

      this.primaryLanguage$.next(currentProject.primaryLanguage);
      this.languages$.next(currentProject.languages);
      this.autoSave$.next(currentProject.autoSave);
      this.indentFormat$.next(currentProject.indentFormat);
    });
  }

  reset() {
    this.primaryLanguage$.next('');
    this.languages$.next([]);
    this.autoSave$.next(false);
    this.indentFormat$.next('  ');
  }
}

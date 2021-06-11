import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

// Services
import { FunctionsService } from '../../services/functions.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'latest-projects-dialog',
  templateUrl: './latest-projects.dialog.html',
  styleUrls: ['./latest-projects.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LatestProjectsDialog {
  projectList$ = new BehaviorSubject([]);

  constructor(
    private dialogRef: MatDialogRef<LatestProjectsDialog>,
    private functions: FunctionsService,
    private projects: ProjectsService,
  ) {
  }

  ngOnInit() {
    this.projectList$.next(_.cloneDeep(this.projects.projectList).map((project: any) => {
      project.displayPath = this.truncatePath(project.path + project.path + project.path);
      project.displayLanguage = project.languages.join(', ');

      return project;
    }));
  }

  openProject(projectPath: string) {
    this.close();
    this.functions.processI18nFolder(projectPath);
  }

  openNewProject() {
    this.close();
    this.functions.openI18nFolder();
  }

  truncatePath(path) {
    if (path.length <= 70) {
      return path;
    }

    return `...${path.slice(path.length - 70, path.length)}`;
  }

  close() {
    this.dialogRef.close();
  }
}


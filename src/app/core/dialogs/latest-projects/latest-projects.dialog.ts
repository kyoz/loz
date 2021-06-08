import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';

// Services
import { FunctionsService } from '../../services/functions.service';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'latest-projects-dialog',
  templateUrl: './latest-projects.dialog.html',
  styleUrls: ['./latest-projects.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LatestProjectsDialog {
  projects = [];

  constructor(
    private dialogRef: MatDialogRef<LatestProjectsDialog>,
    private functions: FunctionsService,
    private setting: SettingService,
  ) {
  }

  ngOnInit() {
    this.projects = _.cloneDeep(this.setting.projects).map(project => {
      project.displayPath = this.truncatePath(project.path + project.path + project.path);
      project.displayLanguage = project.languages.join(', ');

      return project;
    });
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


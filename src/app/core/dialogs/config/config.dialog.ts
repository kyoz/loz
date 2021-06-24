import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// Services
import { TranslateService } from '../../services/translate.service';
import { ProjectsService } from '../../services/projects.service';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'config-dialog',
  templateUrl: './config.dialog.html',
  styleUrls: ['./config.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigDialog {
  constructor(
    private dialogRef: MatDialogRef<ConfigDialog>,
    public translate: TranslateService,
    public projects: ProjectsService,
    public setting: SettingService,
  ) {
  }

  onThemeChange(e) {
    console.log(e);
  }

  onLanguageChange(e) {
    this.translate.changeLanguage(e.value);
  }

  onIndentFormatChange(e) {
    this.projects.currentProject$.value.indentFormat = e.value;
    this.projects.saveCurrentProject();
  }

  onAutoSaveSettingChange(e) {
    this.projects.currentProject$.value.autoSave = e.checked;
    this.projects.saveCurrentProject();
  }

  close() {
    this.dialogRef.close();
  }
}


import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';

// Services
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'config-dialog',
  templateUrl: './config.dialog.html',
  styleUrls: ['./config.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigDialog {
  projects = [];

  constructor(
    private dialogRef: MatDialogRef<ConfigDialog>,
    public setting: SettingService,
  ) {
  }

  ngOnInit() {
    console.log(this.setting.currentProject)
  }

  onThemeChange(e) {
    console.log(e);
  }

  onIndentFormatChange(e) {
    this.setting.currentProject.indentFormat = e.value;
    this.setting.saveCurrentProject();
  }

  onAutoSaveSettingChange(e) {
    this.setting.currentProject.autoSave = e.checked;
    this.setting.saveCurrentProject();
  }

  close() {
    this.dialogRef.close();
  }
}


import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// Services
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'latest-projects-dialog',
  templateUrl: './latest-projects.dialog.html',
  styleUrls: ['./latest-projects.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LatestProjectsDialog {
  constructor(
    private dialogRef: MatDialogRef<LatestProjectsDialog>,
    private functions: FunctionsService,
  ) {
    
  }

  openNewProject() {
    this.close();
    this.functions.openI18nFolder();
  }

  close() {
    this.dialogRef.close();
  }
}


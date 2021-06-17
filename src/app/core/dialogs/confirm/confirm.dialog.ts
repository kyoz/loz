import { Component, ChangeDetectionStrategy, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm.dialog.html',
  styleUrls: ['./confirm.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialog>,
  ) { }

  ok() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close();
  }
}


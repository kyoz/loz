import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

// Services
import { DataService } from '../../services/data.service';

@Component({
  selector: 'translation-add-dialog',
  templateUrl: './translation-add.dialog.html',
  styleUrls: ['./translation-add.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationAddDialog {
  translationId: string;

  constructor(
    private dialogRef: MatDialogRef<TranslationAddDialog>,
    private data: DataService
  ) { }

  ngOnInit() {
    const currentNode = this.data.currentNode$.value;

    if (currentNode && currentNode.path) {
      this.translationId = currentNode.path;
    }
  }

  create() {

  }

  close() {
    this.dialogRef.close();
  }
}


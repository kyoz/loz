import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime, filter } from 'rxjs/operators';
import { Locale } from '../../interfaces';

// Services
import { DataService } from '../../services/data.service';
import { LocaleUtilsService } from '../../services/locale-utils.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'translation-add-dialog',
  templateUrl: './translation-add.dialog.html',
  styleUrls: ['./translation-add.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationAddDialog {
  translationId: string;

  onTranslationIdChange$ = new BehaviorSubject(undefined);

  isDirty = false;
  isValid$ = new BehaviorSubject(undefined);

  constructor(
    private dialogRef: MatDialogRef<TranslationAddDialog>,
    private data: DataService,
    private localeUtils: LocaleUtilsService,
    private notify: NotifyService,
  ) { }

  ngOnInit() {
    this.init();
    this.initListeners();
  }

  init() {
    const currentNode = this.data.currentNode$.value;

    if (currentNode && currentNode.path) {
      this.translationId = `${currentNode.path}.`;
    }
  }

  initListeners() {
    this.onTranslationIdChange$
      .pipe(
        filter(d => d !== undefined),
        distinctUntilChanged(),
        debounceTime(300)
      )
      .subscribe((key: string) => {
        this.isDirty = true;
        this.isValid$.next(this.localeUtils.isValidLocaleKey(key))
    });
  }

  create() {
    if (!this.isDirty) {
      this.isValid$.next(this.localeUtils.isValidLocaleKey(this.translationId))
      return;
    }

    if (!this.isValid$.value || !this.localeUtils.isValidLocaleKey(this.translationId)) {
      return;
    }

    // Check if key is existed
    if (this.data.isExistedKey(this.translationId)) {
      this.notify.pushNotify('Translation Id is already existed. Please use another one')
      return;
    }

    this.close();
    this.data.addId(this.translationId);
  }

  close() {
    this.dialogRef.close();
  }
}


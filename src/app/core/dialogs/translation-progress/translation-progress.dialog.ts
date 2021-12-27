import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';

// Services
import { DataService } from '../../services/data.service';
import { NotifyService } from '../../services/notify.service';
import { SettingService } from '../../services/setting.service';

// Helpers
import { locales } from '../../constants/locales';

@Component({
  selector: 'translation-progress-dialog',
  templateUrl: './translation-progress.dialog.html',
  styleUrls: ['./translation-progress.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationProgressDialog {

  languages$ = new BehaviorSubject([]);

  constructor(
    private dialogRef: MatDialogRef<TranslationProgressDialog>,

    private data: DataService,
    private notify: NotifyService,
    public setting: SettingService,
  ) {
    this.init();
  }

  init() {
    const progress = this.calculate();

    const languages = this.setting.languages$.value.map((lang) => {
      return {
        id: lang,
        progress: progress[lang],
        description: locales.find(l => l.id === lang)?.description || lang
      };
    });

    this.languages$.next(languages);
  }

  close() {
    this.dialogRef.close();
  }

  private calculate() {
    const count = this.recursiveCalculate(this.data.tree$.value);

    const progress: {[lang: string]: number} = {};

    for (const lang of this.setting.languages$.value) {
      progress[lang] = Math.round((count.processed[lang] / count.total) * 10000) / 100;
    }

    return progress;
  }

  private recursiveCalculate(tree) {
    let total = 0;
    const processed = {};
    const languages = this.setting.languages$.value;

    for (const lang of languages) {
      processed[lang] = 0;
    }

    for (const branch of tree) {

      if (branch.values.length) {
        const record = this.data.dataMap[branch.path];

        if (!record) {
          continue;
        }

        total += 1;
        for (const lang of languages) {
          processed[lang] += (record[lang] !== '' && record[lang] !== null && record[lang] !== undefined)
                             ? 1
                             : 0;
        }

      } else {
        const res = this.recursiveCalculate(branch.children);

        total += res.total;
        for (const lang of languages) {
          processed[lang] += res.processed[lang];
        }
      }
    }

    return {
      total,
      processed
    };
  }

}

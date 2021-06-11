import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Services
import { FunctionsService } from '../../services/functions.service';
import { DialogsService } from '../../services/dialogs.service';
import { ProjectsService } from '../../services/projects.service';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'core-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreToolbarComponent {
  isSaving$ = new BehaviorSubject(false);

  constructor(
    public functions: FunctionsService,
    public dialogs: DialogsService,
    public projects: ProjectsService,
    private setting: SettingService,
  ) {
    // This is just an atempt to show a spinner and let user know that loz is 
    // saving their data
    this.functions.onSaveRequest$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(res => {
        if (!res || !this.setting.autoSave$.value) {
          return;
        }

        this.isSaving$.next(true);

        setTimeout(() => {
          this.isSaving$.next(false);
        }, 350)
      });
  }
}


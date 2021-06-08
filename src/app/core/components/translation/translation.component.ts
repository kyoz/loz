import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

// Services
import { SettingService } from '../../services/setting.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'core-translation',
  templateUrl: './translation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTranslationComponent {
  @Input() key: string;
  
  constructor(
    public setting: SettingService,
    public data: DataService,
  ) {
  }
}


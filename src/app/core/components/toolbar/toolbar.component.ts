import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FunctionsService } from '../../services/functions.service';
import { DialogsService } from '../../services/dialogs.service';

@Component({
  selector: 'core-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreToolbarComponent {
  constructor(
    public functions: FunctionsService,
    public dialogs: DialogsService,
  ) {
    
  }
}


import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Services
import { DialogsService } from '../../services/dialogs.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'core-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreStatusBarComponent {
  isSaving$ = new BehaviorSubject(false);

  constructor(
    public dialogs: DialogsService,
    public projects: ProjectsService,
  ) {
  }
}


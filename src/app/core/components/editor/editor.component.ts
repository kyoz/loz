import { Component, ChangeDetectionStrategy } from '@angular/core';

// Services
import { DataService } from '../../services/data.service';

@Component({
  selector: 'core-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreEditorComponent {

  constructor(public data: DataService) { }

}



import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { take } from 'rxjs/operators';

// Services
import { SettingService } from '../../services/setting.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'core-translation',
  templateUrl: './translation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTranslationComponent implements AfterViewInit {
  @ViewChildren('textarea') textareas: QueryList<ElementRef>;

  @Input() key: string;
  
  constructor(
    public setting: SettingService,
    public data: DataService,
    private ngZone: NgZone,
  ) {
  }

  ngAfterViewInit() {
    // This should be ngZone but i'v tested and it seem slower than setTimeout 
    // So for now i use setTimeout
    setTimeout(() => {
      this.textareas.forEach(el => {
        this.adjustHeight(el.nativeElement);
      });
    });
  }

  adjustHeight(el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
}


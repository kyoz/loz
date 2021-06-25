import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';

// Services
import { DataService } from '../../services/data.service';
import { SettingService } from '../../services/setting.service';
import { FunctionsService } from '../../services/functions.service';

@Component({
  selector: 'core-translation',
  templateUrl: './translation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTranslationComponent implements AfterViewInit {
  @ViewChildren('textarea') textareas: QueryList<ElementRef>;

  @Input() key: string;

  constructor(
    public data: DataService,
    public setting: SettingService,
    private functions: FunctionsService
  ) {
  }

  ngAfterViewInit() {
    // This should be ngZone but i'v tested and it seem slower than setTimeout
    // So for now i use setTimeout
    setTimeout(() => {
      this.textareas.forEach((el: ElementRef) => {
        el.nativeElement.style.height = 'auto';
        el.nativeElement.style.height = `${el.nativeElement.scrollHeight}px`;
      });
    });
  }

  onInput(el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    this.functions.onSaveRequest$.next(new Date());
  }
}


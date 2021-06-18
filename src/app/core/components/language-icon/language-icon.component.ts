import { Component, ChangeDetectionStrategy, OnInit, Input } from '@angular/core';

const DEFAULT_ICON = './assets/icons/flags/unknown.png';

@Component({
  selector: 'core-language-icon',
  templateUrl: './language-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreLanguageIcon implements OnInit {
  @Input() languageId: string = DEFAULT_ICON;
  @Input() height: string;

  src = ''

  constructor() {
  }

  ngOnInit() {
    this.src = `./assets/icons/flags/${this.languageId}.png`;
  }

  onLoadImageError() {
    this.src = DEFAULT_ICON;
  }
}


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppStateService {
  onCdkOverlayRightClick$ = new Subject();

  constructor() { }
}

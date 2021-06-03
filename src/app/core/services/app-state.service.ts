import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AppStateService {

  isProcessing$ = new BehaviorSubject(false);

  constructor() { }
}

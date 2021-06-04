import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {

  tree$ = new BehaviorSubject([]);
  currentNode$ = new BehaviorSubject(undefined);

  constructor() { }
}

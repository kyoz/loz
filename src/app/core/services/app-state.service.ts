import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable({providedIn: 'root'})
export class AppStateService {

  constructor(private loader: LoaderService) {
  }
}

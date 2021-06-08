import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// Services
import { TranslateService } from './translate.service';

@Injectable({providedIn: 'root'})
export class NotifyService {

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
  ) { }

  async pushNotify(message: string, params: object = {}, duration = 3000) {
    const snackBarConfig: MatSnackBarConfig = {
      duration,
    };
    const translatedMessage = await this.translate.get(message, params);

    this.snackBar.open(translatedMessage, '', snackBarConfig);
  }
}

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// Dialogs
import { LanguagesDialog } from '../dialogs/languages/languages.dialog';
import { LatestProjectsDialog } from '../dialogs/latest-projects/latest-projects.dialog';

@Injectable({providedIn: 'root'})
export class DialogsService {

  constructor(
    private matDialog: MatDialog,
  ) { }

  openLatestProjects(): void {
    this.matDialog.open(LatestProjectsDialog, {
      autoFocus: false,
      width: '680px',
      height: '520px',
      maxWidth: '94vw',
      maxHeight: '94vh',
    });
  }

  openLanguagesConfig(): void {
    this.matDialog.open(LanguagesDialog, {
      autoFocus: false,
      disableClose: true,
      width: '980px',
      height: '720px',
      maxWidth: '94vw',
      maxHeight: '94vh',
    });
  }
}

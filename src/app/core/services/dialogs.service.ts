import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

// Dialogs
import { ConfigDialog } from '../dialogs/config/config.dialog';
import { CreateProjectDialog } from '../dialogs/create-project/create-project.dialog';
import { LanguagesDialog } from '../dialogs/languages/languages.dialog';
import { LatestProjectsDialog } from '../dialogs/latest-projects/latest-projects.dialog';
import { TranslationAddDialog } from '../dialogs/translation-add/translation-add.dialog';
import { ConfirmDialog } from '../dialogs/confirm/confirm.dialog';


@Injectable({providedIn: 'root'})
export class DialogsService {

  constructor(
    private matDialog: MatDialog,
  ) { }

  openCreateNewProject(): void {
    this.matDialog.open(CreateProjectDialog, {
      autoFocus: false,
      width: '980px',
      height: '820px',
      maxWidth: '94vw',
      maxHeight: '94vh',
    });
  }

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

  openConfiguration(): void {
    this.matDialog.open(ConfigDialog, {
      autoFocus: false,
      width: '580px',
      height: '480px',
      maxWidth: '94vw',
      maxHeight: '94vh',
    });
  }

  openTranslationAdd(): void {
    this.matDialog.open(TranslationAddDialog, {
      autoFocus: true,
      width: '580px',
      height: '264px',
      maxWidth: '94vw',
      maxHeight: '94vh',
    });
  }

  openConfirmDialog(header: string, message: string, color = 'primary') {
    return this.matDialog.open(ConfirmDialog, {
      autoFocus: false,
      width: '480px',
      height: '264px',
      maxWidth: '94vw',
      maxHeight: '94vh',
      data: {
        header,
        message,
        color
      }
    }).afterClosed();
  }
}

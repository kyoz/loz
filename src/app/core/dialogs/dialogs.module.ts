import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponentsModule } from '../modules/material.module';

// Dialogs 
import { LanguagesDialog } from './languages/languages.dialog';
import { LatestProjectsDialog } from './latest-projects/latest-projects.dialog';
import { ConfigDialog } from './config/config.dialog';

const DIALOGS = [
  LanguagesDialog,
  LatestProjectsDialog,
  ConfigDialog,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialComponentsModule,
  ],
  declarations: [
    ...DIALOGS
  ],
  exports: [
    ...DIALOGS
  ],
  entryComponents: [
    ...DIALOGS
  ],
})
export class CoreDialogsModule {	}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialComponentsModule } from '../modules/material.module';

// Dialogs 
import { ConfigDialog } from './config/config.dialog';
import { CreateProjectDialog } from './create-project/create-project.dialog';
import { LanguagesDialog } from './languages/languages.dialog';
import { LatestProjectsDialog } from './latest-projects/latest-projects.dialog';
import { TranslationAddDialog } from './translation-add/translation-add.dialog';

const DIALOGS = [
  ConfigDialog,
  CreateProjectDialog,
  LanguagesDialog,
  LatestProjectsDialog,
  TranslationAddDialog,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
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

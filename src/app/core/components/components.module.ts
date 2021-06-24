import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialComponentsModule } from '../modules/material.module';

// Components
import { CoreEditorComponent } from './editor/editor.component';
import { CoreLanguageIcon } from './language-icon/language-icon.component';
import { CoreStatusBarComponent } from './status-bar/status-bar.component';
import { CoreToolbarComponent } from './toolbar/toolbar.component';
import { CoreTranslationComponent } from './translation/translation.component';
import { CoreTreeComponent } from './tree/tree.component';


const COMPONENTS = [
  CoreEditorComponent,
  CoreLanguageIcon,
  CoreStatusBarComponent,
  CoreToolbarComponent,
  CoreTranslationComponent,
  CoreTreeComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialComponentsModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class CoreComponentsModule {	}

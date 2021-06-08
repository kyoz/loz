import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MaterialComponentsModule } from '../modules/material.module';

// Components
import { CoreToolbarComponent } from './toolbar/toolbar.component';
import { CoreTreeComponent } from './tree/tree.component';
import { CoreEditorComponent } from './editor/editor.component';
import { CoreTranslationComponent } from './translation/translation.component';

const COMPONENTS = [
  CoreToolbarComponent,
  CoreTreeComponent,
  CoreEditorComponent,
  CoreTranslationComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialComponentsModule,
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class CoreComponentsModule {	}

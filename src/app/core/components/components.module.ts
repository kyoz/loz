import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponentsModule } from '../modules/material.module';

// Components
import { CoreToolbarComponent } from './toolbar/toolbar.component';
import { CoreTreeComponent } from './tree/tree.component';
import { CoreEditorComponent } from './editor/editor.component';

const COMPONENTS = [
  CoreToolbarComponent,
  CoreTreeComponent,
  CoreEditorComponent,
];

@NgModule({
  imports: [
    CommonModule,
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

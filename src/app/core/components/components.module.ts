import { NgModule } from '@angular/core';
import { MaterialComponentsModule } from '../modules/material.module';

// Components
import { CoreToolbarComponent } from '../components/toolbar/toolbar.component';
import { CoreTreeComponent } from '../components/tree/tree.component';
import { CoreEditorComponent } from '../components/editor/editor.component';

const COMPONENTS = [
  CoreToolbarComponent,
  CoreTreeComponent,
  CoreEditorComponent,
];

@NgModule({
  imports: [
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

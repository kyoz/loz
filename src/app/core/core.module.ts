import { NgModule } from '@angular/core';
import { CoreComponentsModule } from './components/components.module';
import { CoreDialogsModule } from './dialogs/dialogs.module';

@NgModule({
  declarations: [],
  imports: [
    CoreComponentsModule,
    CoreDialogsModule,
  ],
  exports: [
    CoreComponentsModule,
    CoreDialogsModule,
  ]
})
export class CoreModule { }

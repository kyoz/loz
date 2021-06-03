import { NgModule } from '@angular/core';
import { CoreComponentsModule } from './components/components.module';

@NgModule({
  declarations: [],
  imports: [
    CoreComponentsModule,
  ],
  exports: [
    CoreComponentsModule,
  ]
})
export class CoreModule { }

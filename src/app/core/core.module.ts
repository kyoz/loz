import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponentsModule } from './components/components.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreComponentsModule,
  ],
  exports: [
    CoreComponentsModule,
  ]
})
export class CoreModule { }

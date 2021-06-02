import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

const MODULES = [
  MatButtonModule,
  MatTooltipModule,
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES,
  ]
})
export class MaterialComponentsModule {	}

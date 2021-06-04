import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfig } from './environments/environment';

if (AppConfig.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false
  })
  .then(() => {
    const coreLoaderEl = document.getElementById('CORE_LOADER');

    coreLoaderEl.classList.add('hide');

    // Remove core loader from dom cause it's useless now
    setTimeout(() => {
      coreLoaderEl.parentNode.removeChild(coreLoaderEl);
    }, 1000);
  })
  .catch(err => console.error(err));

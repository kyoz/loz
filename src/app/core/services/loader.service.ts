import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LoaderService {
  loaderEl: HTMLElement;

  constructor() { }

  init(): void {
    const loaderEl = document.getElementById('APP-LOADER');

    if (loaderEl) {
      this.loaderEl = loaderEl;
    }
  }

  show(): void {
    if (this.loaderEl) {
      this.loaderEl.classList.add('show');
    }
  }

  hide(): void {
    if (this.loaderEl) {
      this.loaderEl.classList.remove('show');
    }
  }
}

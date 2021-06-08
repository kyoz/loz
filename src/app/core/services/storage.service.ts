import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class StorageService {

  constructor(
  ) { }

  set(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  get(key: string) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return data;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }
}

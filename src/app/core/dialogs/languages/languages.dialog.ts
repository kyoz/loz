import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { locales } from '../../constants/locales';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import Fuse from 'fuse.js';
import * as _ from 'lodash';

// Services
import { NotifyService } from '../../services/notify.service';
import { ProjectsService } from '../../services/projects.service';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'languages-dialog',
  templateUrl: './languages.dialog.html',
  styleUrls: ['./languages.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguagesDialog implements OnInit, OnDestroy {
  @ViewChild('languageList') languageListEl: ElementRef;
  @ViewChild('search') searchInputEl: ElementRef;

  filteredLanguageList$ = new BehaviorSubject(locales);
  selectedLanguageList$ = new BehaviorSubject([]);

  primaryLanguageId = '';

  onSearch$ = new BehaviorSubject(undefined);

  subs: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<LanguagesDialog>,
    private projects: ProjectsService,
    private setting: SettingService,
    private notify: NotifyService,
  ) {
    if (this.setting.languages$.value.length) {
      this.selectedLanguageList$.next(this.setting.languages$.value.map(langId => {
        return locales.find(d => d.id === langId);
      }));
    }

    if (this.setting.primaryLanguage$.value.length) {
      this.primaryLanguageId = this.setting.primaryLanguage$.value;
    }
  }

  ngOnInit() {
    this.initSearch();
  }

  ngOnDestroy() {
    if (this.subs && this.subs.length > 0) {
      for (const sub of this.subs) {
        sub.unsubscribe();
      }
    }
  }

  initSearch() {
    this.subs.push(
      this.onSearch$.pipe(distinctUntilChanged(), debounceTime(200)).subscribe(searchTerm => {
        if (searchTerm === undefined) {
          return;
        }

        const languagesWithoutSelected = _.xor(locales, this.selectedLanguageList$.value);

        if (searchTerm.length === 0) {
          this.filteredLanguageList$.next(languagesWithoutSelected);
          this.scrollToTop(this.languageListEl);
          return;
        }

        const fuse = new Fuse(languagesWithoutSelected, {
          keys: ['id', 'description']
        });

        const result: any = fuse.search(searchTerm).map(d => d.item);

        this.filteredLanguageList$.next(result);
        this.scrollToTop(this.languageListEl);
      })
    );
  }

  addLanguage(lang) {
    const selectedList = this.selectedLanguageList$.value;
    selectedList.push(lang);

    this.selectedLanguageList$.next(selectedList);
    this.filteredLanguageList$.next(
      this.filteredLanguageList$.value.filter((d) => d.id !== lang.id)
    );
  }

  removeLanguage(lang) {
    const selectedList = this.selectedLanguageList$.value.filter(d => d.id !== lang.id);

    this.selectedLanguageList$.next(selectedList);

    // Remove primary language if selected list is empty or the same as current
    // primary language
    if (selectedList.length === 0 ||
      selectedList.filter(d => d.id === this.primaryLanguageId).length === 0) {

      this.primaryLanguageId = '';
    }

    // Re adding to language list if it match search term
    this.onSearch$.next(undefined);
    this.onSearch$.next(this.searchInputEl.nativeElement.value);
  }

  accept() {
    if (!this.selectedLanguageList$.value.length) {
      this.notify.pushNotify('NOTIFY.SELECT_LANGUAGE');
      return;
    }

    if (!this.primaryLanguageId.length) {
      this.notify.pushNotify('NOTIFY.SELECT_PRIMARY_LANGUAGE');
      return;
    }

    // Store setting to storage
    this.projects.currentProject$.value.languages = this.selectedLanguageList$.value.map(d => d.id);
    this.projects.currentProject$.value.primaryLanguage = this.primaryLanguageId;
    this.projects.saveCurrentProject();

    this.close();
  }

  scrollToTop(container: ElementRef) {
    if (container && container.nativeElement) {
      container.nativeElement.scrollTop = 0;
    }
  }

  close() {
    this.dialogRef.close();
  }
}


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
import { ElectronService } from '../../services/electron.service';
import { FunctionsService } from '../../services/functions.service';
import { TranslateService } from '../../services/translate.service';
import { LoaderService } from '../../services/loader.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'create-project-dialog',
  templateUrl: './create-project.dialog.html',
  styleUrls: ['./create-project.dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateProjectDialog implements OnInit, OnDestroy {
  @ViewChild('languageList') languageListEl: ElementRef;
  @ViewChild('search') searchInputEl: ElementRef;

  // Folders
  pathTitle;
  folderPath$ = new BehaviorSubject('');
  isValidFolder$ = new BehaviorSubject(undefined);

  // Langauges
  filteredLanguageList$ = new BehaviorSubject(locales);
  selectedLanguageList$ = new BehaviorSubject([]);

  primaryLanguageId = '';

  onSearch$ = new BehaviorSubject(undefined);

  subs: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<CreateProjectDialog>,
    private electron: ElectronService,
    private functions: FunctionsService,
    private translate: TranslateService,
    private loader: LoaderService,
    private notify: NotifyService
  ) { }

  ngOnInit() {
    this.initSearch();
    this.translate.get('TITLE.SELECT_AN_EMPTY_FOLDER').then((title) => {
      this.pathTitle = title;
    });
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

  chooseFolder() {
    this.electron.remote.dialog.showOpenDialog(
      this.electron.remote.getCurrentWindow(),
      {
        title: this.pathTitle,
        message: this.pathTitle,
        properties: [
          'openDirectory'
        ]
      }
    ).then((res: any) => {
      if (!res || !res.filePaths || res.filePaths.length === 0) {
        return;
      }

      const folderPath = res.filePaths[0];
      const fileNames = this.electron.fs.readdirSync(folderPath);

      this.folderPath$.next(folderPath);

      if (!fileNames || fileNames.length === 0) {
        this.isValidFolder$.next(true);
      } else {
        this.isValidFolder$.next(false);
      }
    });
  }

  create() {
    if (!this.isValidFolder$.value) {
      this.notify.pushNotify('NOTIFY.INVALID_FOLDER');
      return;
    }

    if (!this.selectedLanguageList$.value.length) {
      this.notify.pushNotify('NOTIFY.NO_SELECTED_LANGUAGE');
      return;
    }

    if (!this.primaryLanguageId) {
      this.notify.pushNotify('NOTIFY.NO_PRIMARY_LANGUAGE');
      return;
    }

    // Starting init project
    this.close();
    this.loader.show();
    const folderPath = this.folderPath$.value;

    // To Ensure everything work correctly, remove folder and create new empty
    // one, cause user can create files to selected folder during create new
    // project
    this.electron.fs.rmdirSync(folderPath, {recursive: true});
    this.electron.fs.mkdirSync(folderPath);

    // Create locale files
    for (const lang of this.selectedLanguageList$.value) {
      this.electron.fs.writeFileSync(`${folderPath}/${lang.id}.json`, '{}');
    }

    this.functions.processI18nFolder(folderPath, this.primaryLanguageId);
    this.notify.pushNotify('NOTIFY.CREATED_PROJECT');
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


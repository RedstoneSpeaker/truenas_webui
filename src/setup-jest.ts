// eslint-disable-next-line max-classes-per-file
import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MATERIAL_SANITY_CHECKS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry } from '@angular/material/icon/testing';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { defineGlobalsInjections } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  MissingTranslationHandler, TranslateCompiler, TranslateLoader, TranslateModule, TranslateFakeLoader,
} from '@ngx-translate/core';
import failOnConsole from 'jest-fail-on-console';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { MockComponent, MockProvider } from 'ng-mocks';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import {
  Observable,
} from 'rxjs';
import { defaultLanguage } from 'app/constants/languages.constant';
import { EmptyApiService } from 'app/core/testing/utils/empty-api.service';
import { EmptyAuthService } from 'app/core/testing/utils/empty-auth.service';
import { RequiresRolesDirective } from 'app/directives/requires-roles/requires-roles.directive';
import { UiSearchDirective } from 'app/directives/ui-search.directive';
import { WINDOW } from 'app/helpers/window.helper';
import { AuthService } from 'app/modules/auth/auth.service';
import { FormActionsComponent } from 'app/modules/forms/ix-forms/components/form-actions/form-actions.component';
import {
  IxButtonGroupComponent,
} from 'app/modules/forms/ix-forms/components/ix-button-group/ix-button-group.component';
import { IxCheckboxComponent } from 'app/modules/forms/ix-forms/components/ix-checkbox/ix-checkbox.component';
import {
  IxCheckboxListComponent,
} from 'app/modules/forms/ix-forms/components/ix-checkbox-list/ix-checkbox-list.component';
import { IxChipsComponent } from 'app/modules/forms/ix-forms/components/ix-chips/ix-chips.component';
import { IxComboboxComponent } from 'app/modules/forms/ix-forms/components/ix-combobox/ix-combobox.component';
import { IxErrorsComponent } from 'app/modules/forms/ix-forms/components/ix-errors/ix-errors.component';
import { IxExplorerComponent } from 'app/modules/forms/ix-forms/components/ix-explorer/ix-explorer.component';
import { IxFieldsetComponent } from 'app/modules/forms/ix-forms/components/ix-fieldset/ix-fieldset.component';
import { IxFileInputComponent } from 'app/modules/forms/ix-forms/components/ix-file-input/ix-file-input.component';
import { IxFormSectionComponent } from 'app/modules/forms/ix-forms/components/ix-form-section/ix-form-section.component';
import { IxIconGroupComponent } from 'app/modules/forms/ix-forms/components/ix-icon-group/ix-icon-group.component';
import { IxInputComponent } from 'app/modules/forms/ix-forms/components/ix-input/ix-input.component';
import { IxLabelComponent } from 'app/modules/forms/ix-forms/components/ix-label/ix-label.component';
import { IxListItemComponent } from 'app/modules/forms/ix-forms/components/ix-list/ix-list-item/ix-list-item.component';
import { IxListComponent } from 'app/modules/forms/ix-forms/components/ix-list/ix-list.component';
import { IxRadioGroupComponent } from 'app/modules/forms/ix-forms/components/ix-radio-group/ix-radio-group.component';
import { IxSelectComponent } from 'app/modules/forms/ix-forms/components/ix-select/ix-select.component';
import {
  IxSlideToggleComponent,
} from 'app/modules/forms/ix-forms/components/ix-slide-toggle/ix-slide-toggle.component';
import { IxTextareaComponent } from 'app/modules/forms/ix-forms/components/ix-textarea/ix-textarea.component';
import { WarningComponent } from 'app/modules/forms/ix-forms/components/warning/warning.component';
import { FormErrorHandlerService } from 'app/modules/forms/ix-forms/services/form-error-handler.service';
import { IxIconRegistry } from 'app/modules/ix-icon/ix-icon-registry.service';
import { IxIconComponent } from 'app/modules/ix-icon/ix-icon.component';
import { IxTableComponent } from 'app/modules/ix-table/components/ix-table/ix-table.component';
import { IxTableBodyComponent } from 'app/modules/ix-table/components/ix-table-body/ix-table-body.component';
import { IxTableHeadComponent } from 'app/modules/ix-table/components/ix-table-head/ix-table-head.component';
import { IxTablePagerComponent } from 'app/modules/ix-table/components/ix-table-pager/ix-table-pager.component';
import { IxTableEmptyDirective } from 'app/modules/ix-table/directives/ix-table-empty.directive';
import { IcuMissingTranslationHandler } from 'app/modules/language/translations/icu-missing-translation-handler';
import {
  WithLoadingStateDirective,
} from 'app/modules/loader/directives/with-loading-state/with-loading-state.directive';
import { LoaderService } from 'app/modules/loader/loader.service';
import {
  ModalHeaderComponent,
} from 'app/modules/slide-ins/components/modal-header/modal-header.component';
import { TestOverrideDirective } from 'app/modules/test-id/test-override/test-override.directive';
import { TestDirective } from 'app/modules/test-id/test.directive';
import { ApiService } from 'app/modules/websocket/api.service';
import { ErrorHandlerService } from 'app/services/errors/error-handler.service';

setupZoneTestEnv();

const silenceJsDomCssParseError: (message: string, methodName: string) => boolean = (message, methodName) => {
  return (
    methodName === 'error' && message.startsWith('Error: Could not parse CSS stylesheet')
  );
};
failOnConsole({ silenceMessage: silenceJsDomCssParseError });

jest.setTimeout(30 * 1000);

defineGlobalsInjections({
  imports: [
    HttpClientModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatMenuModule,
    IxIconComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
    MatSortModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatBadgeModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    IxInputComponent,
    IxCheckboxComponent,
    IxRadioGroupComponent,
    IxSelectComponent,
    IxFieldsetComponent,
    ModalHeaderComponent,
    IxFormSectionComponent,
    IxButtonGroupComponent,
    IxExplorerComponent,
    IxFileInputComponent,
    IxTextareaComponent,
    IxSlideToggleComponent,
    IxIconGroupComponent,
    IxChipsComponent,
    IxComboboxComponent,
    IxListComponent,
    IxListItemComponent,
    IxErrorsComponent,
    IxLabelComponent,
    WarningComponent,
    IxCheckboxListComponent,
    FormActionsComponent,
    RouterModule.forRoot([]),
    UiSearchDirective,
    RequiresRolesDirective,
    IxTableComponent,
    IxTablePagerComponent,
    IxTableEmptyDirective,
    IxTableHeadComponent,
    IxTableBodyComponent,
    TestDirective,
    TestOverrideDirective,
    WithLoadingStateDirective,
    TranslateModule.forRoot({
      defaultLanguage,
      loader: {
        provide: TranslateLoader,
        useClass: TranslateFakeLoader,
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: IcuMissingTranslationHandler,
      },
      useDefaultLang: false,
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
  ],
  declarations: [
    MockComponent(ModalHeaderComponent),
  ],
  providers: [
    MockProvider(HighContrastModeDetector),
    {
      provide: APP_BASE_HREF,
      useValue: '',
    },
    {
      provide: MATERIAL_SANITY_CHECKS,
      useValue: false,
    },
    {
      provide: WINDOW,
      // eslint-disable-next-line no-restricted-globals
      useValue: window,
    },
    mockProvider(LoaderService, {
      withLoader: () => (source$: Observable<unknown>) => source$,
    }),
    mockProvider(ErrorHandlerService, {
      withErrorHandler: () => (source$: Observable<unknown>) => source$,
    }),
    mockProvider(FormErrorHandlerService),
    {
      provide: AuthService,
      useClass: EmptyAuthService,
    },
    {
      provide: ApiService,
      useClass: EmptyApiService,
    },
    { provide: IxIconRegistry, useClass: FakeMatIconRegistry },
    { provide: MatIconRegistry, useClass: FakeMatIconRegistry },
  ],
});

beforeEach(() => {
  // eslint-disable-next-line no-restricted-globals
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: unknown) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // eslint-disable-next-line no-restricted-globals
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    })),
  });
});

// https://github.com/jsdom/jsdom/issues/3002
Range.prototype.getBoundingClientRect = () => ({
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
} as DOMRect);
Range.prototype.getClientRects = () => ({
  item: () => null,
  length: 0,
  [Symbol.iterator]: jest.fn(),
});

// eslint-disable-next-line no-restricted-globals
Object.defineProperty(window.URL, 'createObjectURL', { value: () => '' });

Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    mark: () => {},
    measure: () => {},
  },
});

class MockDataTransfer {
  private filesArray: File[] = [];

  get items(): DataTransferItemList {
    return {
      add: (file: File) => this.filesArray.push(file),
      remove: (index: number) => this.filesArray.splice(index, 1),
    } as unknown as DataTransferItemList;
  }

  get files(): FileList {
    // Simple FileList mock that references our filesArray
    const fileList: Partial<FileList> = {
      length: this.filesArray.length,
      item: (index: number) => this.filesArray[index] || null,
      * [Symbol.iterator]() {
        for (let i = 0; i < Number(this.length); i++) {
          yield this.item(i);
        }
      },
    };
    // We can manually copy properties to make it more FileList-like
    this.filesArray.forEach((file, index) => {
      fileList[index] = file;
    });
    return fileList as FileList;
  }
}

// 2. Create a mock for ClipboardEvent that uses the above DataTransfer
class MockClipboardEvent extends Event {
  clipboardData: DataTransfer;

  constructor(type: string, eventInitDict?: ClipboardEventInit) {
    super(type, eventInitDict);
    this.clipboardData = new MockDataTransfer() as unknown as DataTransfer;
  }
}

// 3. Attach both mocks to global
Object.defineProperty(global, 'ClipboardEvent', {
  value: MockClipboardEvent,
});

Object.defineProperty(global, 'DataTransfer', {
  value: MockDataTransfer,
});

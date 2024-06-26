import {
  ChangeDetectionStrategy,
  ChangeDetectorRef, Component, Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { map, of } from 'rxjs';
import { DatasetPreset } from 'app/enums/dataset.enum';
import { ExplorerNodeType } from 'app/enums/explorer-type.enum';
import { Role } from 'app/enums/role.enum';
import { mapToOptions } from 'app/helpers/options.helper';
import { helptextTruecloudBackup } from 'app/helptext/data-protection/truecloud-backup/cloudsync';
import {
  CloudBackup, CloudBackupRestoreParams, CloudBackupSnapshot, SnapshotIncludeExclude,
} from 'app/interfaces/cloud-backup.interface';
import { CloudCredential } from 'app/interfaces/cloud-sync-task.interface';
import { DatasetCreate } from 'app/interfaces/dataset.interface';
import { ExplorerNodeData, TreeNode } from 'app/interfaces/tree-node.interface';
import { TreeNodeProvider } from 'app/modules/ix-forms/components/ix-explorer/tree-node-provider.interface';
import { IxSlideInRef } from 'app/modules/ix-forms/components/ix-slide-in/ix-slide-in-ref';
import { SLIDE_IN_DATA } from 'app/modules/ix-forms/components/ix-slide-in/ix-slide-in.token';
import { FormErrorHandlerService } from 'app/modules/ix-forms/services/form-error-handler.service';
import { SnackbarService } from 'app/modules/snackbar/services/snackbar.service';
import { FilesystemService } from 'app/services/filesystem.service';
import { WebSocketService } from 'app/services/ws.service';

@UntilDestroy()
@Component({
  selector: 'ix-cloud-backup-restore-from-snapshot-form',
  templateUrl: './cloud-backup-restore-from-snapshot-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloudBackupRestoreFromSnapshotFormComponent implements OnInit {
  readonly requiredRoles = [Role.CloudBackupWrite];

  readonly helptext = helptextTruecloudBackup;

  fileNodeProvider: TreeNodeProvider;
  bucketNodeProvider: TreeNodeProvider;

  readonly includeExcludeOptions = new Map<SnapshotIncludeExclude, string>([
    [SnapshotIncludeExclude.IncludeEverything, this.translate.instant('Include everything')],
    [SnapshotIncludeExclude.IncludeFromSubFolder, this.translate.instant('Include from subfolder')],
    [SnapshotIncludeExclude.ExcludePaths, this.translate.instant('Select paths to exclude')],
    [SnapshotIncludeExclude.ExcludeByPattern, this.translate.instant('Exclude by pattern')],
  ]);
  readonly includeExcludeOptions$ = of(mapToOptions(this.includeExcludeOptions, this.translate));

  get title(): string {
    return this.translate.instant('Restore from Snapshot');
  }

  form = this.fb.group({
    target: [null as string, Validators.required],
    includeExclude: [SnapshotIncludeExclude.IncludeEverything, Validators.required],
    excludedPaths: [[] as string[], Validators.required],
    excludePattern: [null as string | null, Validators.required],
    subFolder: ['/'],
    includedPaths: [[] as string[]],
  });

  isLoading = false;

  createDatasetProps: Omit<DatasetCreate, 'name'> = {
    share_type: DatasetPreset.Generic,
  };

  get isExcludePathsSelected(): boolean {
    return this.form.controls.includeExclude.value === SnapshotIncludeExclude.ExcludePaths;
  }

  get isExcludeByPatternSelected(): boolean {
    return this.form.controls.includeExclude.value === SnapshotIncludeExclude.ExcludeByPattern;
  }

  get isIncludeFromSubfolderSelected(): boolean {
    return this.form.controls.includeExclude.value === SnapshotIncludeExclude.IncludeFromSubFolder;
  }

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private ws: WebSocketService,
    private cdr: ChangeDetectorRef,
    private snackbar: SnackbarService,
    private errorHandler: FormErrorHandlerService,
    private slideInRef: IxSlideInRef<CloudBackupSnapshot>,
    private filesystemService: FilesystemService,
    @Inject(SLIDE_IN_DATA) public data: { backup: CloudBackup; snapshot: CloudBackupSnapshot },
  ) {}

  ngOnInit(): void {
    this.setFileNodeProvider();
    this.setBucketNodeProvider();
    this.disableHiddenFields();
    this.listenForFormChanges();
  }

  onSubmit(): void {
    this.isLoading = true;

    const options = {
      exclude: this.isExcludeByPatternSelected
        ? [this.form.controls.excludePattern.value]
        : this.form.controls.excludedPaths.value,
      include: this.isIncludeFromSubfolderSelected ? this.form.value.includedPaths : null,
    };

    if (!options.exclude?.length) delete options.exclude;
    if (!options.include?.length) delete options.include;

    const params = [
      this.data.backup.id,
      this.data.snapshot.id,
      this.isIncludeFromSubfolderSelected ? this.form.controls.subFolder.value : '/',
      this.form.controls.target.value,
      options,
    ] as CloudBackupRestoreParams;

    this.ws.job('cloud_backup.restore', params)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.snackbar.success(this.translate.instant('Cloud Backup Restored Successfully'));
          this.isLoading = false;
          this.slideInRef.close(true);
        },
        error: (error: unknown) => {
          this.isLoading = false;
          this.errorHandler.handleWsFormError(error, this.form);
          this.cdr.markForCheck();
        },
      });
  }

  getBucketsNodeProvider(): TreeNodeProvider {
    return (node: TreeNode<ExplorerNodeData>) => {
      const data = {
        credentials: (this.data.backup.credentials as CloudCredential).id,
        attributes: {
          folder: node.data.path,
        },
        args: '',
      };

      return this.ws.call('cloudsync.list_directory', [data]).pipe(
        map((listing) => {
          const nodes: ExplorerNodeData[] = [];

          listing.forEach((file) => {
            if (file.IsDir) {
              nodes.push({
                path: `${data.attributes.folder}/${file.Name}`.replace(/\/+/g, '/'),
                name: file.Name,
                type: ExplorerNodeType.Directory,
                hasChildren: true,
              });
            }
          });

          return nodes;
        }),
      );
    };
  }

  private listenForFormChanges(): void {
    this.form.controls.includeExclude.valueChanges.pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.disableHiddenFields();

        if (this.isExcludePathsSelected) {
          this.form.controls.excludedPaths.enable();
        } else if (this.isExcludeByPatternSelected) {
          this.form.controls.excludePattern.enable();
        } else if (this.isIncludeFromSubfolderSelected) {
          this.form.controls.subFolder.enable();
          this.form.controls.includedPaths.enable();
        }

        this.cdr.markForCheck();
        this.form.updateValueAndValidity();
      },
    });

    this.form.controls.subFolder.valueChanges.pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.form.controls.includedPaths.setValue([]);
      },
    });
  }

  private setFileNodeProvider(): void {
    this.fileNodeProvider = this.filesystemService.getFilesystemNodeProvider({ directoriesOnly: true });
  }

  private setBucketNodeProvider(): void {
    this.bucketNodeProvider = this.getBucketsNodeProvider();
  }

  private disableHiddenFields(): void {
    this.form.controls.excludePattern.disable();
    this.form.controls.excludedPaths.disable();
    this.form.controls.includedPaths.disable();
    this.form.controls.subFolder.disable();
  }
}

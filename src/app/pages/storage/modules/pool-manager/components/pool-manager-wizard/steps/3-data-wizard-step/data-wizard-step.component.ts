import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { CreateVdevLayout, VdevType } from 'app/enums/v-dev-type.enum';
import helptext from 'app/helptext/storage/volumes/manager/manager';
import { IxSimpleChanges } from 'app/interfaces/simple-changes.interface';
import { PoolManagerStore } from 'app/pages/storage/modules/pool-manager/store/pool-manager.store';

@UntilDestroy()
@Component({
  selector: 'ix-data-wizard-step',
  templateUrl: './data-wizard-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataWizardStepComponent implements OnChanges {
  @Input() isStepActive: boolean;
  @Output() goToLastStep = new EventEmitter<void>();
  @Output() goBackStep = new EventEmitter<void>();
  @Output() stepStatusValidityChanged = new EventEmitter<boolean>();

  hasDataVdevs: boolean;

  protected readonly VdevType = VdevType;
  protected readonly inventory$ = this.store.getInventoryForStep(VdevType.Data);
  protected allowedLayouts = Object.values(CreateVdevLayout);
  readonly helptext = helptext;

  constructor(
    private store: PoolManagerStore,
  ) {}

  ngOnChanges(changes: IxSimpleChanges<this>): void {
    if (changes.isStepActive.currentValue) {
      this.store.topology$.pipe(map((topology) => topology[VdevType.Data].vdevs.length > 0))
        .pipe(untilDestroyed(this))
        .subscribe((result) => {
          this.hasDataVdevs = result;

          if (this.isStepActive) {
            this.stepStatusValidityChanged.emit(result);
          }
        });
    }
  }

  goToBackStep(): void {
    this.goBackStep.emit();
  }

  goToReviewStep(): void {
    this.goToLastStep.emit();
  }
}
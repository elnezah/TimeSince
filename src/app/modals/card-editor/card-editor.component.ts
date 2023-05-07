import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-editor',
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.scss'],
})
export class CardEditorComponent implements OnInit {
  private static readonly TAG = 'CardEditorComponent';

  amount: any;
  multiplier: any;
  public units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
  public selectedUnit = this.units[0];
  public multipliers = [
    { name: 'none', value: 1 },
    { name: 'thousand', value: 1000 },
    { name: 'million', value: 1000000 },
    { name: 'billion', value: 1000000000000 },
  ];
  public selectedMultiplier = this.multipliers[0];

  public constructor(private modalController: ModalController) {}

  ngOnInit() {}

  public onSelectedMultiplier($event: Event) {
    if (!($event instanceof CustomEvent)) {
      return;
    }

    this.selectedMultiplier = $event.detail.value;
  }

  public async onClickOnCancel(): Promise<void> {
    await this.modalController.dismiss('cancel');
  }

  public async onClickOnSave(): Promise<void> {
    await this.modalController.dismiss(
      {
        title: `${this.amount * this.selectedMultiplier.value} ${
          this.selectedUnit
        }`,
        adder: {
          amount: this.amount * this.selectedMultiplier.value,
          unit: this.selectedUnit,
        },
      },
      'save'
    );
  }

  public async onUnitChange($event: Event) {
    if (!($event instanceof CustomEvent)) {
      return;
    }

    this.selectedUnit = $event.detail.value;
  }

  public onAmountChange($event: Event): void {
    if (!($event instanceof CustomEvent)) {
      return;
    }

    this.amount = $event.detail.value;
  }
}

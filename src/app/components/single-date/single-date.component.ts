import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AlertController, IonPopover, ModalController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import { CardEditorComponent } from 'src/app/modals/card-editor/card-editor.component';

export interface SingleDateCard {
  title: string;
  adder: {
    amount: number;
    unit: dayjs.ManipulateType;
  };
  date?: dayjs.Dayjs;
}

@Component({
  selector: 'app-single-date',
  templateUrl: './single-date.component.html',
  styleUrls: ['./single-date.component.scss'],
})
export class SingleDateComponent implements OnChanges {
  private static readonly TAG = 'SingleDateComponent';

  @ViewChild('refDatePickerPopOver') refDatePickerPopOver:
    | IonPopover
    | undefined;

  @Input() referenceDate: dayjs.Dayjs | undefined;
  @Output() referenceDateChange = new EventEmitter<dayjs.Dayjs>();
  @Input() cards: SingleDateCard[] = [];
  @Output() cardsChange = new EventEmitter<SingleDateCard[]>();

  public readonly today = dayjs();

  public constructor(
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.refresh();
  }

  //region Listeners

  public onReferenceDateChange($event: Event): void {
    this.refDatePickerPopOver?.dismiss();

    if (!($event instanceof CustomEvent)) {
      return;
    }

    this.referenceDate = dayjs($event.detail.value);
    this.refresh();
    this.referenceDateChange.emit(this.referenceDate);
  }

  public async onClickOnAdd(): Promise<void> {
    const modal = await this.modalController.create({
      component: CardEditorComponent,
    });
    await modal.present();
    const { role, data } = await modal.onDidDismiss();

    if (role === 'cancel') {
      return;
    }

    this.cards.push(data);
    this.refresh();
    this.cardsChange.emit(this.cards);
  }

  public async onClickOnManualEntry(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Enter a date',
      inputs: [
        {
          name: 'date',
          placeholder: '21-10-1998',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'ion-color-danger',
        },
        {
          text: 'Ok',
          role: 'ok',
        },
      ],
    });
    await alert.present();
    const { role, data } = await alert.onDidDismiss();
    if (role === 'cancel') {
      return;
    }

    try {
      this.referenceDate = dayjs(data.values.date, [
        'DD-MM-YYYY',
        'D-MM-YYYY',
        'DD-M-YYYY',
        'D-M-YYYY',
        'DD-MM-YY',
        'D-MM-YY',
        'DD-M-YY',
        'D-M-YY',
      ]);
    } catch {
      console.error('Invalid date', data);
    }

    this.refresh();
  }

  public onClickOnRemoveCard(index: number): void {
    this.cards.splice(index, 1);
    this.cardsChange.emit(this.cards);
  }
  //endregion

  public isPast(d: dayjs.Dayjs | undefined): boolean {
    if (!d) {
      return false;
    }

    return d.isBefore(this.today);
  }

  private refresh() {
    if (!this.referenceDate) return;

    this.cards.forEach((card) => {
      card.date = this.referenceDate?.add(card.adder.amount, card.adder.unit);
    });
  }
}

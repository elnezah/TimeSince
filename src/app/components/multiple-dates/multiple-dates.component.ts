import { AlertController, IonPopover, ModalController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import { CardEditorComponent } from 'src/app/modals/card-editor/card-editor.component';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export interface MultipleDatesCard {
  title: string;
  adder: {
    amount: number;
    unit: dayjs.ManipulateType;
  };
  date?: dayjs.Dayjs;
}

export interface MultipleDatesDate {
  id: number;
  date: dayjs.Dayjs;
  name: string;
}

@Component({
  selector: 'app-multiple-dates',
  templateUrl: './multiple-dates.component.html',
  styleUrls: ['./multiple-dates.component.scss'],
})
export class MultipleDatesComponent implements OnInit, OnChanges {
  private static readonly TAG = 'MultipleDatesComponent';

  @ViewChild('refDatePickerPopOver') refDatePickerPopOver:
    | IonPopover
    | undefined;

  @Input() referenceDates: MultipleDatesDate[] | undefined;
  @Output() referenceDatesChange = new EventEmitter<MultipleDatesDate[]>();
  @Input() cards: MultipleDatesCard[] = [];
  @Output() cardsChange = new EventEmitter<MultipleDatesCard[]>();

  public readonly today = dayjs();
  private nextDateId = 0;

  public constructor(
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  public ngOnInit(): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.refresh();
  }

  //region Listeners

  public onReferenceDateChange($event: Event, index: number): void {
    if (!($event instanceof CustomEvent)) {
      return;
    }

    if (!this.referenceDates) this.referenceDates = [];

    this.referenceDates[index].date = dayjs($event.detail.value);
    this.refresh();
    this.referenceDatesChange.emit(this.referenceDates);
  }

  public async onClickOnAddCard(): Promise<void> {
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

  public onClickOnDeleteDate(index: number) {
    this.referenceDates?.splice(index, 1);
    this.refresh();
  }

  public onClickOnRemoveCard(index: number): void {
    this.cards.splice(index, 1);
    this.cardsChange.emit(this.cards);
  }

  public onClickOnAddReferenceDate(): void {
    if (!this.referenceDates) this.referenceDates = [];
    this.referenceDates.push({ id: this.nextDateId, name: '', date: dayjs() });
    this.nextDateId++;
    this.refresh();
    this.referenceDatesChange.emit(this.referenceDates);
  }
  //endregion

  public isPast(d: dayjs.Dayjs | undefined): boolean {
    if (!d) {
      return false;
    }

    return d.isBefore(this.today);
  }

  private refresh() {
    if (!this.referenceDates) return;
    console.log('TEST');

    this.cards.forEach((card) => this.calculateCard(card));
  }

  private calculateCard(card: MultipleDatesCard): void {
    if (!this.referenceDates) return;
    const datesArray = this.referenceDates
      .map((date) => date.date)
      .sort((a, b) => a.diff(b));
    let remaining = dayjs
      .duration(card.adder.amount, card.adder.unit)
      .asMilliseconds();

    for (let i = 0; i < datesArray.length - 1; i++) {
      const d1 = datesArray[i];
      const d2 = datesArray[i + 1];

      const difference = d2.diff(d1);
      if (difference >= remaining) {
        card.date = d1.add(remaining / (i + 1), 'milliseconds');
        return;
      } else {
        const a = difference * (i + 1);
        remaining -= a;
      }
    }
    card.date = datesArray[datesArray.length - 1].add(remaining / datesArray.length, 'milliseconds');
  }
}

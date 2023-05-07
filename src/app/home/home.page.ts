import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPopover } from '@ionic/angular';
import * as dayjs from 'dayjs';

interface KeyDateCard {
  title: string;
  adder: {
    amount: number;
    unit: dayjs.ManipulateType;
  };
  date?: dayjs.Dayjs;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
onClickOnManualEntry() {
throw new Error('Method not implemented.');
}
  private static readonly TAG = 'HomePage';

  @ViewChild('refDatePickerPopOver') refDatePickerPopOver:
    | IonPopover
    | undefined;

  public readonly today = dayjs();
  public referenceDate = dayjs('1978-02-17');
  public keyDates: KeyDateCard[] = [
    {
      title: '1.000 days',
      adder: {
        amount: 1000,
        unit: 'day',
      },
    },
    {
      title: '10.000 days',
      adder: {
        amount: 10000,
        unit: 'day',
      },
    },
    {
      title: '20.000 days',
      adder: {
        amount: 20000,
        unit: 'day',
      },
    },
    {
      title: 'one million seconds',
      adder: {
        amount: 1000000000,
        unit: 'second',
      },
    },
  ];

  public constructor() {}

  public ngOnInit(): void {
    this.refresh();
  }

  public onReferenceDateChange($event: Event): void {
    this.refDatePickerPopOver?.dismiss();

    if (!($event instanceof CustomEvent)) {
      return;
    }

    this.referenceDate = dayjs($event.detail.value);
    this.refresh();
  }

  public isPast(d: dayjs.Dayjs | undefined): boolean {
    if (!d) {
      return false;
    }

    return d.isBefore(this.today);
  }

  private refresh() {
    this.keyDates.forEach((keyDate) => {
      console.log(HomePage.TAG, 'refresh', keyDate);
      keyDate.date = this.referenceDate.add(
        keyDate.adder.amount,
        keyDate.adder.unit
      );
    });
  }
}

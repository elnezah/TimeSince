import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonPopover, ModalController } from '@ionic/angular';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import { CardEditorComponent } from '../modals/card-editor/card-editor.component';
dayjs.extend(customParseFormat);

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

  public constructor(
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  public ngOnInit(): void {
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

  public async onClickOnAdd(): Promise<void> {
    const modal = await this.modalController.create({
      component: CardEditorComponent,
    });
    await modal.present();
    const { role, data } = await modal.onDidDismiss();
    if (role === 'cancel') {
      return;
    }

    console.log(HomePage.TAG, 'onClickOnAdd', {data, role});

    this.keyDates.push(data);
    this.refresh();
  }
  //endregion

  public isPast(d: dayjs.Dayjs | undefined): boolean {
    if (!d) {
      return false;
    }

    return d.isBefore(this.today);
  }

  private refresh() {
    this.keyDates.forEach((keyDate) => {
      keyDate.date = this.referenceDate.add(
        keyDate.adder.amount,
        keyDate.adder.unit
      );
    });
  }
}

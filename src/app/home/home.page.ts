import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  StorageService,
  prefIndividualCard,
  prefIndividualReferenceDate,
} from '../services/storage.service';
import { SingleDateCard } from '../components/single-date/single-date.component';
dayjs.extend(customParseFormat);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private static readonly TAG = 'HomePage';

  public referenceDate = dayjs('1978-02-17');
  public cards: SingleDateCard[] = [
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

  public constructor(private storageService: StorageService) {}

  public async ngOnInit(): Promise<void> {
    const rd = await this.storageService.get(prefIndividualReferenceDate);
    if (rd && rd instanceof String) {
      this.referenceDate = dayjs(rd as string);
    }

    const c = await this.storageService.get(prefIndividualCard);
    if (c && c instanceof Array) {
      this.cards = c as SingleDateCard[];
    }

    console.log(HomePage.TAG, 'ngOnInit', {rd, c});
  }

  //region Listeners

  public async onSingleDateReferenceDateChange(): Promise<void> {
    await this.storageService.set(
      prefIndividualReferenceDate,
      this.referenceDate.toISOString()
    );
  }

  public async onCardsChange(): Promise<void> {
    await this.storageService.set(prefIndividualCard, this.cards);
  }
  //endregion
}

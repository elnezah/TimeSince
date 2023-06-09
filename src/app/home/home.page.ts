import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  StorageService,
  prefIndividualCard,
  prefIndividualReferenceDate,
  prefMultipleCard,
  prefMultipleReferenceDate,
} from '../services/storage.service';
import { SingleDateCard } from '../components/single-date/single-date.component';
import {
  MultipleDatesCard,
  MultipleDatesDate,
} from '../components/multiple-dates/multiple-dates.component';
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
  public referenceDatesMultiple: MultipleDatesDate[] = [];
  public cardsMultiple: MultipleDatesCard[] = [];

  public selectedTab: 'single' | 'multiple' = 'single';

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

    const rdMultiple = await this.storageService.get(prefMultipleReferenceDate);
    if (rdMultiple && rdMultiple instanceof Array) {
      this.referenceDatesMultiple = rdMultiple as MultipleDatesDate[];
    }

    const cMultiple = await this.storageService.get(prefMultipleCard);
    if (cMultiple && cMultiple instanceof Array) {
      this.cardsMultiple = cMultiple as MultipleDatesCard[];
    }
  }

  //region Listeners

  public async onSingleDateReferenceDateChange(): Promise<void> {
    await this.storageService.set(
      prefIndividualReferenceDate,
      this.referenceDate.toISOString()
    );
    await this.storageService.set(prefMultipleReferenceDate, this.cards);
  }

  public async onCardsChange(): Promise<void> {
    await this.storageService.set(prefIndividualCard, this.cards);
    await this.storageService.set(prefMultipleCard, this.cardsMultiple);
  }
  //endregion
}

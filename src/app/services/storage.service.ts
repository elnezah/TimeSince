import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export const prefIndividualReferenceDate = 'prefIndividualReferenceDate';
export const prefIndividualCard = 'prefIndividualCard';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private static readonly TAG = 'StorageService';

  public constructor() {}

  public async set(key: string, value: any): Promise<void> {
    return await Preferences.set({
      key,
      value: JSON.stringify(value),
    });
  }

  public async get(key: string): Promise<any> {
    const res = (await Preferences.get({key})).value;
    return res ? JSON.parse(res) : null;
  }
}

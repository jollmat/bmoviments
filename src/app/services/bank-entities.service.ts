import { Injectable } from '@angular/core';
import { BankEntityInterface } from '../model/interfaces/bank-entity.interface';

@Injectable({
  providedIn: 'root'
})
export class BankEntitiesService {

  bankEntities: BankEntityInterface[] = [];

  constructor() {
    this.bankEntities = [
      {
        name: 'Banc Sabadell',
        symbol: 'BS',
        templateNumCols: 7,
        templateFilePrefix: 'BS'
      },
      {
        name: 'Caixabank',
        symbol: 'CBK',
        templateNumCols: 6,
        templateFilePrefix: 'CBK'
      }
    ];
  }

  getBankEntityByFilename(fileName: string): BankEntityInterface {
    return this.bankEntities.find((bankEntity) => {
      return fileName.startsWith(bankEntity.templateFilePrefix);
    });
  }
  
}

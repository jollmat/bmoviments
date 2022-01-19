import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MovimentBSEntity } from 'src/app/model/entities/moviment-BS-entity';

import * as moment from 'moment';
import { AppUtils } from 'src/app/model/utils/app-utils';

@Component({
  selector: 'app-bs-last-moviments',
  templateUrl: './bs-last-moviments.component.html',
  styleUrls: ['./bs-last-moviments.component.scss']
})
export class BsLastMovimentsComponent implements OnChanges {

  @Input() moviments: MovimentBSEntity[];

  items: MovimentBSEntity[];
  maxItems = 5;

  constructor() {}

  sortByDateFn(strDate: string) {
    return moment(strDate, 'DD/MM/YYYY').valueOf();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.moviments?.currentValue) {
      this.items = [...this.moviments];

      if (this.items.length > this.maxItems) {
        this.items = AppUtils.sortArrayBy(this.items, 'dataOperacio', false, this.sortByDateFn).slice(0, this.maxItems);
      } else {
        this.items = AppUtils.sortArrayBy(this.items, 'dataOperacio', false, this.sortByDateFn);
      }
    }
  }

}

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MovimentBSEntity } from 'src/app/model/entities/moviment-BS-entity';
import { AppUtils } from 'src/app/model/utils/app-utils';

@Component({
  selector: 'app-bs-top-incoming',
  templateUrl: './bs-top-incoming.component.html',
  styleUrls: ['./bs-top-incoming.component.scss']
})
export class BsTopIncomingComponent implements OnChanges {

  @Input() moviments: MovimentBSEntity[];

  items: MovimentBSEntity[];

  maxItems = 5;

  isGrouped: boolean = true;

  constructor() {}

  updateItems(): void {
    let moviments = this.moviments.map(a => Object.assign({}, a));
    if (this.isGrouped) {
      this.items = [];
      moviments.forEach((_m) => {
        const mIndex = this.items.findIndex((item) => { return item.concepte === _m.concepte });
        if (mIndex !== -1) {
          this.items[mIndex].importOperacio += _m.importOperacio;
        } else {
          this.items.push(_m);
        }
      });
    } else {
      this.items = [...moviments];
    }
    this.items = this.items.filter(m => m.importOperacio > 0);
    if (this.items.length > this.maxItems) {
      this.items = AppUtils.sortArrayBy(this.items, 'importOperacio', false).slice(0, this.maxItems);
    } else {
      this.items = AppUtils.sortArrayBy(this.items, 'importOperacio', false);
    }
    if (this.isGrouped) {
      this.items.map((item, idx) => {
        // item.dataOperacio = (idx + 1).toFixed(0);
        item.dataOperacio = '';
        return item;
      });
    }
  }

  toggleGrouping(event: PointerEvent): void {
    this.isGrouped = event.target['checked'];
    this.updateItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.moviments?.currentValue) {
      this.updateItems();
    }
  }

}

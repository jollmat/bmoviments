import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MovimentBSEntity } from 'src/app/model/entities/moviment-BS-entity';
import { ApplicationService } from 'src/app/services/application-service';

import { faCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-storage-capacity-monitor',
  templateUrl: './storage-capacity-monitor.component.html',
  styleUrls: ['./storage-capacity-monitor.component.scss']
})
export class StorageCapacityMonitorComponent implements OnChanges {

  @Input() moviments: MovimentBSEntity[];

  maxSize = 5; // Mb
  currentSize = 0;

  faCircle = faCircle;

  constructor(
    private appService: ApplicationService
  ) { }
  

  getStorageCurrentSize(): void {
    const targetStorage = (this.appService.isDemo()) ? sessionStorage : localStorage;
    const storageKey = this.appService.getStorageKey();
    let total: number = 0;
    
    for(var x in targetStorage) {
      if (typeof targetStorage[x] === 'string' && x === storageKey) {
        var amount = (targetStorage[x].length * 2) / 1024 / 1024;
        total += amount;
      }
    }
    this.currentSize = Number.parseFloat(total.toFixed(2));
  }

  getStorageRemainingSize(): number {
    return 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getStorageCurrentSize();
  }

}

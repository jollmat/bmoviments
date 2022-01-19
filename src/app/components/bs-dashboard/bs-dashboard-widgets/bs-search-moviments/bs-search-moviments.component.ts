import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MovimentBSEntity } from 'src/app/model/entities/moviment-BS-entity';

import * as moment from 'moment';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { filter } from 'rxjs/internal/operators/filter';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { AppUtils } from 'src/app/model/utils/app-utils';
import { ConceptsService } from 'src/app/services/concepts.service';

@Component({
  selector: 'app-bs-search-moviments',
  templateUrl: './bs-search-moviments.component.html',
  styleUrls: ['./bs-search-moviments.component.scss']
})
export class BsSearchMovimentsComponent implements OnChanges, AfterViewInit {

  @Input() moviments: MovimentBSEntity[];

  @Output() filteredMovimentsEmitter = new EventEmitter<MovimentBSEntity[]>();
  @Output() actionInCourseEmitter = new EventEmitter<boolean>();
  
  @ViewChild('searchInput') inputSearchField: ElementRef;
  searchText: string = new Date().getFullYear().toString();

  items: MovimentBSEntity[];
  maxItems = 10000;

  importTotal: number = 0;

  constructor(private conceptsService: ConceptsService) {}

  sortByDateFn(strDate: string) {
    return moment(strDate, 'DD/MM/YYYY').valueOf();
  }

  doFilter (sortFn: any) {
    this.actionInCourseEmitter.emit(true);
    this.items = [...this.moviments].filter((m) => {
      return this.isFilteredMoviment(m);
    });
    this.items = AppUtils.sortArrayBy(this.items, 'dataOperacio', false, sortFn);
    this.filteredMovimentsEmitter.emit(this.items);
    this.calculateAmount();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.moviments?.currentValue) {
      this.doFilter (this.sortByDateFn);
    }
  }

  isFilteredMoviment(moviment: MovimentBSEntity) {

    const searchTextValues = this.searchText?.split(' ');

    const hasConceptMapperApplied = moviment.concepte !== moviment.concepteOriginal;

    if (hasConceptMapperApplied) {
      moviment.tags = this.conceptsService.getMovimentTags(moviment);
    }
    
    if (searchTextValues?.length > 1) {
      const matchString = moviment.concepte + 
        moviment.dataOperacio + 
        AppUtils.numberFormat(moviment.importOperacio, 2) + 
        moviment.bankEntitySymbol + 
        (moviment.tags.join(''));

      let matchesAll = true;
      
      for (let i=0; i<searchTextValues.length; i++) {
        if (matchString.toLowerCase().indexOf(searchTextValues[i].toLowerCase()) === -1) {
         matchesAll = false;
         break;
        }
      }
      return matchesAll;
    }

    return this.searchText?.length === 0 ||
      moviment.concepte.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 ||
      moviment.dataOperacio.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 ||
      AppUtils.numberFormat(moviment.importOperacio, 2).toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 ||
      moviment.bankEntitySymbol.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1 || 
      moviment.tags?.join('').toLowerCase().indexOf(this.searchText.toLowerCase()) > -1;
  }

  calculateAmount() {
    this.importTotal = 0;
    this.items.forEach((m) => {
      this.importTotal += m.importOperacio;
    });
    this.actionInCourseEmitter.emit(false);
  }

  ngAfterViewInit() {
    fromEvent(this.inputSearchField.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(350),
            distinctUntilChanged(),
            tap((text) => {
              if (this.inputSearchField.nativeElement.value.length >= 2 || this.inputSearchField.nativeElement.value.length === 0) {
                this.searchText = this.inputSearchField.nativeElement.value;
                this.doFilter(this.sortByDateFn);
              }
            })
        )
        .subscribe();
  }

}

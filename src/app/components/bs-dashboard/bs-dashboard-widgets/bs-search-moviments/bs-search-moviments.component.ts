import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MovimentBSEntity } from 'src/app/model/entities/moviment-BS-entity';

import * as moment from 'moment';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { filter } from 'rxjs/internal/operators/filter';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { tap } from 'rxjs/internal/operators/tap';
import { AppUtils } from 'src/app/model/utils/app-utils';
import { ConceptsService } from 'src/app/services/concepts.service';
import { PrompterService } from 'src/app/services/prompter.service';
import { Subject } from 'rxjs';
import { ApplicationService } from 'src/app/services/application-service';

@Component({
  selector: 'app-bs-search-moviments',
  templateUrl: './bs-search-moviments.component.html',
  styleUrls: ['./bs-search-moviments.component.scss']
})
export class BsSearchMovimentsComponent implements OnChanges, AfterViewInit {

  @Input() moviments: MovimentBSEntity[];

  @Output() filteredMovimentsEmitter = new EventEmitter<MovimentBSEntity[]>();
   
  @ViewChild('searchInput') inputSearchField;
  @Input() searchText: string = '';
  searchTextUpdate = new Subject<string>();

  items: MovimentBSEntity[];
  maxItems = 10000;

  importTotal: number = 0;

  constructor(
    private conceptsService: ConceptsService,
    private prompterService: PrompterService,
    private appService: ApplicationService
  ) {}

  sortByDateFn(strDate: string) {
    return moment(strDate, 'DD/MM/YYYY').valueOf();
  }

  doFilter (sortFn: any) {
    this.prompterService.prompt('Filtrant moviments');
    this.appService.actionInCourse$.next(true);

    this.items = [...this.moviments].filter((m) => {
      return this.isFilteredMoviment(m);
    });
    this.items = AppUtils.sortArrayBy(this.items, 'dataOperacio', false, sortFn);
    
    this.filteredMovimentsEmitter.emit(this.items);
    this.prompterService.prompt(undefined);

    this.calculateAmount();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.moviments?.currentValue) {
      this.doFilter (this.sortByDateFn);
    }
    if (changes?.searchText?.currentValue) {
      this.searchTextUpdate.next(changes.searchText.currentValue);
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
    this.prompterService.prompt('Calculant total...');
    this.appService.actionInCourse$.next(true);
    this.importTotal = 0;
    this.items.forEach((m) => {
      this.importTotal += m.importOperacio;
    });
    this.appService.actionInCourse$.next(false);
    this.prompterService.prompt(undefined);
  }

 ngAfterViewInit() {
    this.searchTextUpdate.pipe(
      debounceTime(600),
      distinctUntilChanged())
      .subscribe(value => {
        this.doFilter(this.sortByDateFn);
      });
  }

}

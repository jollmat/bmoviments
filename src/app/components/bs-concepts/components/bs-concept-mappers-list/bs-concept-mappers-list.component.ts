import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { ConceptMapperInterface } from 'src/app/model/interfaces/concept-mapper.interface';
import { AppUtils } from 'src/app/model/utils/app-utils';

@Component({
  selector: 'app-bs-concept-mappers-list',
  templateUrl: './bs-concept-mappers-list.component.html',
  styleUrls: ['./bs-concept-mappers-list.component.scss']
})
export class BsConceptMappersListComponent implements OnChanges{

  @Input() conceptMappers: ConceptMapperInterface[] = [];

  @Output() onConceptMappersChangeEmitter = new EventEmitter<ConceptMapperInterface[]>();

  @ViewChild('searchOriginalInput') inputsearchOriginal: ElementRef;
  @ViewChild('searchOutputInput') inputSearchOutput: ElementRef;

  conceptMappersList: ConceptMapperInterface[] = [];
  
  constructor() { }

  sortInfo: { sortField: string, sortAsc: boolean } = { sortField: 'matching', sortAsc: false };
  filterInfo: { original: string, output: string } = { original : '', output: '' };

  sort(sortField?: string) {
    if (!sortField) {
      sortField = this.sortInfo.sortField;
    }
    this.sortInfo.sortAsc = (this.sortInfo.sortField !== sortField) ? true : !this.sortInfo.sortAsc;
    this.sortInfo.sortField = sortField;
    this.conceptMappersList = AppUtils.sortArrayBy(this.conceptMappers, this.sortInfo.sortField, this.sortInfo.sortAsc);
  }

  filter() {
    this.conceptMappersList = this.conceptMappers.filter((conceptMapper) => {
      return (this.filterInfo.original.length === 0 && this.filterInfo.output.length === 0) ||
             (this.filterInfo.original.length > 0 && conceptMapper.matching.toLowerCase().indexOf(this.filterInfo.original.toLowerCase()) > -1) ||
             (this.filterInfo.output.length > 0 && conceptMapper.output.toLowerCase().indexOf(this.filterInfo.output.toLowerCase()) > -1)
    });
  }

  ngAfterViewInit() {
    fromEvent(this.inputsearchOriginal.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(350),
            distinctUntilChanged(),
            tap((keyEvent: KeyboardEvent) => {
              this.filter();
            })
        )
        .subscribe();

      fromEvent(this.inputSearchOutput.nativeElement,'keyup')
        .pipe(
            filter(Boolean),
            debounceTime(350),
            distinctUntilChanged(),
            tap((keyEvent: KeyboardEvent) => {
              this.filter();
            })
        )
        .subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.conceptMappers.currentValue) {
      this.sort(this.sortInfo.sortField);
    }
  }

}

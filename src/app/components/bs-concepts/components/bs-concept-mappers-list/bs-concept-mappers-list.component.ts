import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { ConceptMapperInterface } from 'src/app/model/interfaces/concept-mapper.interface';
import { AppUtils } from 'src/app/model/utils/app-utils';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { PrompterService } from 'src/app/services/prompter.service';

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

  conceptMapperEditIndex: number = -1;

  newMatchingValue: string = '';
  newOutputValue: string = '';

  faTrash = faTrash;

  doCreate: boolean = false;
  
  constructor(private prompterService: PrompterService) { }

  sortInfo: { sortField: string, sortAsc: boolean } = { sortField: 'matching', sortAsc: false };
  filterInfo: { original: string, output: string } = { original : '', output: '' };

  sort(sortField?: string) {
    this.prompterService.prompt('Ordenant conceptes...');
    if (!sortField) {
      sortField = this.sortInfo.sortField;
    }
    this.sortInfo.sortAsc = (this.sortInfo.sortField !== sortField) ? true : !this.sortInfo.sortAsc;
    this.sortInfo.sortField = sortField;
    this.conceptMappersList = AppUtils.sortArrayBy(this.conceptMappers, this.sortInfo.sortField, this.sortInfo.sortAsc);
    this.prompterService.prompt(undefined);
  }

  filter() {
    this.conceptMappersList = this.conceptMappers.filter((conceptMapper) => {
      return (this.filterInfo.original.length === 0 && this.filterInfo.output.length === 0) ||
             (this.filterInfo.original.length > 0 && conceptMapper.matching.toLowerCase().indexOf(this.filterInfo.original.toLowerCase()) > -1) ||
             (this.filterInfo.output.length > 0 && conceptMapper.output.toLowerCase().indexOf(this.filterInfo.output.toLowerCase()) > -1)
    });
  }

  editConceptMapper(idx: number, targetId?: string) {
    this.conceptMapperEditIndex = idx;
    if(targetId) {
      setTimeout(() => {
        document.getElementById(targetId).focus();
      }, 300);      
    }
  }

  addNewConceptMapper() {

    if(this.conceptMappersList.some((_conceptMapper) => {
      return _conceptMapper.matching === this.newMatchingValue;
    })) {
      alert('Concepte original ja existent!');
    } else {
      this.conceptMappersList.push({
        matching: this.newMatchingValue.toUpperCase(),
        output: this.newOutputValue.toUpperCase()
      });
      this.onConceptMappersChangeEmitter.emit(this.conceptMappersList);
      this.doCreate = false;
      this.newMatchingValue = '';
      this.newOutputValue = '';
      this.prompterService.prompt('Afegit nou concepte', 3000);
    }
  }

  deleteConceptMapper(idx: number) {
    this.conceptMappersList.splice(idx, 1);
    this.onConceptMappersChangeEmitter.emit(this.conceptMappersList);
    this.prompterService.prompt('Concepte el.liminat', 3000);
  }

  saveConceptMapper(idx: number, field: string, event: Event) {
    if (event.target['value'].length === 0) {
      alert('El camp no pot estar buit');
    } else {
      this.conceptMappersList[idx][field] = event.target['value'].toUpperCase();
      this.onConceptMappersChangeEmitter.emit(this.conceptMappersList);
      this.editConceptMapper(-1);
      this.prompterService.prompt('Concepte desat', 3000);
    }
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

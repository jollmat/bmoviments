import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MovimentBSInterface } from 'src/app/model/interfaces/moviment-BS-interface';
import { ApplicationService } from 'src/app/services/application-service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

import { FileLoadedInterface } from 'src/app/model/interfaces/file-loaded.interface';
import { ConceptMapperInterface } from 'src/app/model/interfaces/concept-mapper.interface';
import { ConceptsService } from 'src/app/services/concepts.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-bs-dashboard-header',
  templateUrl: './bs-dashboard-header.component.html',
  styleUrls: ['./bs-dashboard-header.component.scss']
})
export class BSDashboardHeaderComponent implements OnInit, AfterViewInit {

  @Input() moviments: MovimentBSInterface[];
  @Input() actionInCourse: boolean = false;

  @Output() onFileLoadedEmitter = new EventEmitter<FileLoadedInterface>();
  @Output() onFileLoaderStartedEmitter = new EventEmitter<number>(); // Emits total files number
  @Output() onFileLoaderFinishedEmitter = new EventEmitter<number>(); // Emits loaded files number
  @Output() onResetDemoEmitter = new EventEmitter<boolean>();
  @Output() onSaveConceptMappersEmitter = new EventEmitter<boolean>();
  @Output() onFilterEmitter = new EventEmitter<string>();


  @ViewChild('searchInput') inputSearchField;
  searchText: string = new Date().getFullYear().toString();
  searchTextUpdate = new Subject<string>();

  isDemo = false;

  constructor(
    private appService: ApplicationService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private conceptsService: ConceptsService
  ) { }
  
  onFileLoadEmit(fileLoaded: FileLoadedInterface) {
    this.onFileLoadedEmitter.emit(fileLoaded);
  }

  onFileLoadStartEmit(numFiles: number) {
    this.onFileLoaderStartedEmitter.emit(numFiles);
  };

  onFileLoadFinishEmit(numFiles: number) {
    this.onFileLoaderFinishedEmitter.emit(numFiles);
  };

  onSaveConceptMappersEmit(conceptMappersList: ConceptMapperInterface[]) {
    this.onSaveConceptMappersEmitter.emit(true);
    /*
    this.conceptsService.setConceptMappers(conceptMappersList).subscribe(()=> {
      this.onSaveConceptMappersEmitter.emit(false);
    });
    */
  }

  reset(): void {
    if (confirm('S\'esborraràn tots els moviments i els hauràs de tornar a importar. N\'estàs segur?')) {
      if(this.isDemo) {
        this.sessionStorageService.removeAllMoviments().subscribe(() => {
          this.onResetDemoEmitter.emit(true);
        });
      } else {
        this.localStorageService.removeAllMoviments().subscribe(() => {
          this.onResetDemoEmitter.emit(true);
        });
      }
    }
  }

  ngOnInit(): void {
    this.isDemo = this.appService.isDemo();
  }

  ngAfterViewInit() {
      this.searchTextUpdate.pipe(
        debounceTime(600),
        distinctUntilChanged())
        .subscribe(value => {
          this.onFilterEmitter.emit(value);
        });

      this.onFilterEmitter.emit(this.searchText);
  }
  
}

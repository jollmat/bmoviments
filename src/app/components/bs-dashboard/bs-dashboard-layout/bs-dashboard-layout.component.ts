import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { MovimentBSDTO } from 'src/app/model/dtos/moviment-BS-DTO';
import { MovimentBSEntity } from 'src/app/model/entities/moviment-BS-entity';
import { MovimentBSInterface } from 'src/app/model/interfaces/moviment-BS-interface';
import { ApplicationService } from 'src/app/services/application-service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

import * as uuid from 'uuid';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { ConceptsService } from 'src/app/services/concepts.service';
import { FileLoadedInterface } from 'src/app/model/interfaces/file-loaded.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bs-dashboard-layout',
  templateUrl: './bs-dashboard-layout.component.html',
  styleUrls: ['./bs-dashboard-layout.component.scss']
})
export class BSDashboardLayoutComponent implements OnInit, OnDestroy {

  movimentsAll: MovimentBSEntity[] = [];
  movimentsFiltrats: MovimentBSEntity[] = [];

  actionInCourseSubscription?: Subscription;
  actionInCourse = false;

  loadFilesTotal: number = 0;
  loadedFilesTotal: number = 0;
  addedMovimentsTotal: number = 0;
  duplicatedMovimentsFoundTotal: number = 0;

  loadMovimentsSubscription?: Subscription;

  searchText!: string;

  constructor(
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private appService: ApplicationService,
    private conceptsService: ConceptsService,
    private snotifyService: SnotifyService
  ) { }

  configMoviments(moviments: MovimentBSDTO[]) {
    this.movimentsAll = [];

    for (let moviment of moviments) {
      this.movimentsAll.push(MovimentBSDTO.toEntity(moviment));
    }
    this.setActionInCourse(false);
  }

  getStoredMoviments() {
    this.setActionInCourse(true);

    if (this.appService.isDemo()){
      this.loadMovimentsSubscription = this.sessionStorageService.getMoviments().subscribe((sessionStorageMoviments) => {
        this.configMoviments(sessionStorageMoviments);
      });
    } else {
      this.loadMovimentsSubscription = this.localStorageService.getMoviments().subscribe((localStorageMoviments) => {
        this.configMoviments(localStorageMoviments);
      });
    }
  }

  onLoadFilesInit(totalFilesToLoad: number): void {
    this.setActionInCourse(true);
    this.loadFilesTotal = totalFilesToLoad;
    this.addedMovimentsTotal = 0;
    this.duplicatedMovimentsFoundTotal = 0;
  }

  onLoadFilesEnd(totalFilesLoaded: number) {
    this.setActionInCourse(false);

    this.snotifyService.success('S\'han carregat ' + this.addedMovimentsTotal + ' moviments de ' + totalFilesLoaded + ' fitxers', 'Èxit', {
      timeout: 5000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true
    });

    if (this.duplicatedMovimentsFoundTotal > 0) {
      this.snotifyService.warning('Hi ha hagut ' + this.duplicatedMovimentsFoundTotal + ' moviments que ja existien i no s\'han afegit.', 'Atenció', {
        timeout: 5000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true
      });
    }

    this.getStoredMoviments();
  }

  onFileLoaded(fileLoaded: FileLoadedInterface) {
    let movimentsToSynchronize: MovimentBSDTO[] = [];

    if (fileLoaded.hasErrors) {

      this.snotifyService.error(fileLoaded.message, 'Atenció', {
        timeout: 5000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true
      });

    } else {

      const moviments = this.appService.excludeIgnoredMoviments(fileLoaded.moviments) as MovimentBSInterface[];

      // Setup moviments to sync
      moviments.forEach((moviment) => {
        this.conceptsService.applyConceptMapper(moviment);
        if (!this.isStoredMoviment(moviment)) {
          movimentsToSynchronize.push(MovimentBSEntity.toDTO(moviment));
        } else {
          this.duplicatedMovimentsFoundTotal++;
        }
      });
  
      // Synchronize if necessary and reload stored movements
      if (movimentsToSynchronize.length > 0) {
        
        let movimentsToStore: MovimentBSDTO[] = [];
        this.movimentsAll.forEach((_m) => {
          movimentsToStore.push(MovimentBSEntity.toDTO(_m));
        });
  
        movimentsToSynchronize.map((_m) => {
          _m.id = uuid.v1();
          return _m;
        });
  
        this.movimentsAll = [...this.movimentsAll,...movimentsToSynchronize.map((_m) => {
          return MovimentBSDTO.toEntity(_m);
        })];
  
        this.addedMovimentsTotal += movimentsToSynchronize.length;
  
        if (this.appService.isDemo()) {
          this.sessionStorageService.updateMoviments([...movimentsToStore,...movimentsToSynchronize]).subscribe(() => {});
        } else {
          this.localStorageService.updateMoviments([...movimentsToStore,...movimentsToSynchronize]).subscribe(() => { });
        } 
      }

    }
    
  }

  isStoredMoviment (m: MovimentBSEntity) {
    return this.movimentsAll.findIndex((storedMoviment) => {
      return storedMoviment.dataOperacio === m.dataOperacio && 
      storedMoviment.concepte === m.concepte && 
      storedMoviment.importOperacio === m.importOperacio;
    }) > -1;
  }

  doFilter(searchText: string) {
    this.searchText = searchText;
  }

  setFilteredMoviments(movimentsFiltrats: MovimentBSEntity[]) {
    this.movimentsFiltrats = movimentsFiltrats;
    this.setActionInCourse(false);
  }

  setActionInCourse(actionInCourse: boolean): void {
    this.appService.actionInCourse$.next(actionInCourse);
  }

  ngOnInit(): void {
    this.getStoredMoviments();
    this.actionInCourseSubscription = this.appService.actionInCourse$.subscribe((_actionInCourse) => { 
      this.actionInCourse = _actionInCourse;
    });
  }

  ngOnDestroy(): void {
    if (this.loadMovimentsSubscription) {
      this.loadMovimentsSubscription.unsubscribe();
    }
    if (this.actionInCourseSubscription) {
      this.actionInCourseSubscription.unsubscribe();
    }
  }

}

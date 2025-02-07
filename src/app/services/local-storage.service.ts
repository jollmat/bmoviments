import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MovimentBSDTO } from '../model/dtos/moviment-BS-DTO';
import { ApplicationService } from './application-service';
import { ConceptsService } from './concepts.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private appService: ApplicationService,
    private conceptsService: ConceptsService
    ) { }

  getMoviments(): Observable<MovimentBSDTO[]> {
    let localMovimentsStr = localStorage.getItem(this.appService.getStorageKey());
    if (localMovimentsStr) {
      let localMoviments = eval(localMovimentsStr) as MovimentBSDTO[];
      localMoviments = localMoviments.map((m) => {
        this.conceptsService.applyConceptMapper(m);
        return m;
      });
      return of(this.appService.excludeIgnoredMoviments(localMoviments));
    } else if (!this.appService.isDemo()){
      return of([])
    } else {
      return of([]);
    }
  }

  updateMoviments(moviments: MovimentBSDTO[]): Observable<boolean> {
    moviments = this.appService.excludeIgnoredMoviments(moviments);
    moviments = moviments.map((m) => {
      this.conceptsService.applyConceptMapper(m);
      return m;
    });
    localStorage.setItem(this.appService.getStorageKey(), JSON.stringify(moviments));
    return of(true);
  }

  deleteMoviment(movimentId: string): Observable<boolean> {
    let localMovimentsStr = localStorage.getItem(this.appService.getStorageKey());
    if (localMovimentsStr) {
      const localMoviments = eval(localMovimentsStr) as MovimentBSDTO[];
      const idx = localMoviments.findIndex((m) => {
        return m.id === movimentId;
      });
      if (idx>=0) {
        localMoviments.splice(idx, 1);
        localStorage.setItem(this.appService.getStorageKey(), JSON.stringify(localMoviments));
        return of(true);
      } else {
        return of(false);
      }
    } else {
      return of(false);
    }
  }

  deleteMoviments(movimentsId: string[]): Observable<boolean> {
    let localMovimentsStr = localStorage.getItem(this.appService.getStorageKey());
    if (localMovimentsStr) {
      const localMoviments = eval(localMovimentsStr) as MovimentBSDTO[];
      const newMoviments = localMoviments.filter((moviment) => {
        return movimentsId.indexOf(moviment.id) < 0;
      });
      localStorage.setItem(this.appService.getStorageKey(), JSON.stringify(newMoviments));
      return of(true);
    } else {
      return of(false);
    }
  }

  removeAllMoviments(): Observable<boolean> {
    localStorage.removeItem(this.appService.getStorageKey());
    return of(true);
  }
}

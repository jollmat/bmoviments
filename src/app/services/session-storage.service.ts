import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IGNORED_CONCEPTS } from '../model/constants/ignored-concepts.constant';
import { MovimentBSDTO } from '../model/dtos/moviment-BS-DTO';
import { ApplicationService } from './application-service';
import { ConceptsService } from './concepts.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor(
    private appService: ApplicationService,
    private conceptsService: ConceptsService
  ) { }

  getMoviments(): Observable<MovimentBSDTO[]> {
    console.log(' -> SessionStorageService.getMoviments()');
    const sessionMovimentsStr = sessionStorage.getItem(this.appService.getStorageKey());
    if (sessionMovimentsStr) {
      let sessionMoviments = eval(sessionMovimentsStr) as MovimentBSDTO[];
      sessionMoviments = sessionMoviments.map((m) => {
        this.conceptsService.applyConceptMapper(m);
        return m;
      });
      return of(this.appService.excludeIgnoredMoviments(sessionMoviments));
    } else if (!this.appService.isDemo()){
      return of([])
    } else {
      return of([]);
    }
  }

  updateMoviments(moviments: MovimentBSDTO[]): Observable<boolean> {
    console.log(' -> SessionStorageService.updateMoviments()');
    moviments = this.appService.excludeIgnoredMoviments(moviments);
    moviments = moviments.map((m) => {
      this.conceptsService.applyConceptMapper(m);
      return m;
    });
    sessionStorage.setItem(this.appService.getStorageKey(), JSON.stringify(moviments));
    return of(true);
  }

  deleteMoviment(movimentId: string): Observable<boolean> {
    console.log(' -> SessionStorageService.deleteMoviment(' + movimentId + ')');
    let sessionMovimentsStr = sessionStorage.getItem(this.appService.getStorageKey());
    if (sessionMovimentsStr) {
      const sessionMoviments = eval(sessionMovimentsStr) as MovimentBSDTO[];
      const idx = sessionMoviments.findIndex((m) => {
        return m.id === movimentId;
      });
      if (idx>=0) {
        sessionMoviments.splice(idx, 1);
        sessionStorage.setItem(this.appService.getStorageKey(), JSON.stringify(sessionMoviments));
        return of(true);
      } else {
        return of(false);
      }
    } else {
      return of(false);
    }
  }

  deleteMoviments(movimentsId: string[]): Observable<boolean> {
    console.log(' -> SessionStorageService.deleteMoviments()', movimentsId);
    let sessionMovimentsStr = sessionStorage.getItem(this.appService.getStorageKey());
    if (sessionMovimentsStr) {
      const sessionMoviments = eval(sessionMovimentsStr) as MovimentBSDTO[];
      const newMoviments = sessionMoviments.filter((moviment) => {
        return movimentsId.indexOf(moviment.id) < 0;
      });
      sessionStorage.setItem(this.appService.getStorageKey(), JSON.stringify(newMoviments));
      return of(true);
    } else {
      return of(false);
    }
  }

  removeAllMoviments(): Observable<boolean> {
    console.log(' -> SessionStorageService.removeAllMoviments()');
    sessionStorage.removeItem(this.appService.getStorageKey());
    return of(true);
  }
}

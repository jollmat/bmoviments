import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CONCEPT_MAPPERS } from 'src/assets/data/bs-concept-definitions';
import { MovimentBSDTO } from '../model/dtos/moviment-BS-DTO';
import { ConceptMapperInterface } from '../model/interfaces/concept-mapper.interface';
import { MovimentBSInterface } from '../model/interfaces/moviment-BS-interface';

@Injectable({
  providedIn: 'root'
})
export class ConceptsService {

  CONCEPT_MAPPERS_STORAGE_KEY: string = 'bs-concept-mappers';
  source: Storage = localStorage;

  conceptMappers: ConceptMapperInterface[];

  removableStrings: string[];
  replaceableStrings: Array<string[]>;

  constructor() {
    this.removableStrings = [
        'COMPRA TARJ. 5402XXXXXXXX9018 ',
        'COMPRA TARG. 5402XXXXXXXX9018 '
    ];
    this.replaceableStrings = [
      ['ADEUDO RECIBO', 'REBUT']
    ];
    this.setConceptMappers(CONCEPT_MAPPERS);
  }

  loadConceptMappers(): Observable<ConceptMapperInterface[]>{
    const storedData = this.source.getItem(this.CONCEPT_MAPPERS_STORAGE_KEY);
    let res: ConceptMapperInterface[] = [];
    if(storedData) {
      res = eval(storedData) as ConceptMapperInterface[];
    }
    this.conceptMappers = res;
    return of(res);
  }

  getConceptMappers(): Observable<ConceptMapperInterface[]>{
    return of(this.conceptMappers);
  }

  setConceptMappers(conceptMappers: ConceptMapperInterface[]): Observable<boolean> {
    this.source.setItem(this.CONCEPT_MAPPERS_STORAGE_KEY, JSON.stringify(conceptMappers));
    this.conceptMappers = conceptMappers;
    return of(true);
  }

  applyConceptMapper (moviment: MovimentBSInterface | MovimentBSDTO): void{

    this.conceptMappers.forEach((conceptMapper) => {
      if (moviment.concepte.toLowerCase().indexOf(conceptMapper.matching.toLowerCase()) >= 0) {
        moviment.concepte = conceptMapper.output;
      }
    });

    this.removableStrings.forEach((removableString) => {
      moviment.concepte = moviment.concepte.replace(removableString, '');
    });

    this.replaceableStrings.forEach((replaceableString, index) => {
      moviment.concepte = moviment.concepte.replace (this.replaceableStrings[index][0], this.replaceableStrings[index][1]);
    });
  }

  getMovimentTags(moviment: MovimentBSInterface | MovimentBSDTO): string[] {
    const mapper = this.conceptMappers.find((_mapper) => {
      return moviment.concepteOriginal.toLowerCase().indexOf(_mapper.matching.toLowerCase()) >= 0;
    });
    if (mapper?.tags) {
      return mapper.tags;
    }
    return [];
  }
}

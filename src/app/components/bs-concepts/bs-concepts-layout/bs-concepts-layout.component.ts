import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ConceptMapperInterface } from 'src/app/model/interfaces/concept-mapper.interface';
import { ConceptsService } from 'src/app/services/concepts.service';

@Component({
  selector: 'app-bs-concepts-layout',
  templateUrl: './bs-concepts-layout.component.html',
  styleUrls: ['./bs-concepts-layout.component.scss']
})
export class BsConceptsLayoutComponent implements OnInit {

  @Output() onConceptMappersChangeEmitter = new EventEmitter<true>();

  conceptMappers: ConceptMapperInterface[] = [];

  constructor(
    private conceptsService: ConceptsService
  ) { }

  loadConceptMappers(): void {
    this.conceptsService.getConceptMappers().subscribe((conceptMappers) => {
      this.conceptMappers = conceptMappers;
    });
  }

  saveConceptMappers(conceptMappers: ConceptMapperInterface[]) {
    this.conceptsService.setConceptMappers(conceptMappers).subscribe(() => {
      this.loadConceptMappers();
      this.onConceptMappersChangeEmitter.emit(true);
    });
  }

  ngOnInit(): void {
    this.loadConceptMappers();
  }

}

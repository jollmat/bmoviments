import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MovimentBSEntity } from 'src/app/model/entities/moviment-BS-entity';
import { MovimentBSInterface } from 'src/app/model/interfaces/moviment-BS-interface';
import { ApplicationService } from 'src/app/services/application-service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FileLoadedEntity } from 'src/app/model/entities/file-loaded.entity';
import { FileLoadedInterface } from 'src/app/model/interfaces/file-loaded.interface';

@Component({
  selector: 'app-bs-dashboard-header',
  templateUrl: './bs-dashboard-header.component.html',
  styleUrls: ['./bs-dashboard-header.component.scss']
})
export class BSDashboardHeaderComponent implements OnInit {

  @Input() moviments: MovimentBSInterface[];

  @Output() onFileLoadedEmitter = new EventEmitter<FileLoadedInterface>();
  @Output() onFileLoaderStartedEmitter = new EventEmitter<number>(); // Emits total files number
  @Output() onFileLoaderFinishedEmitter = new EventEmitter<number>(); // Emits loaded files number
  @Output() onResetDemoEmitter = new EventEmitter<boolean>();
  @Output() onSaveConceptMappersEmitter = new EventEmitter<boolean>();

  isDemo = false;

  faBars = faBars;

  constructor(
    private appService: ApplicationService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService
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

  onSaveConceptMappersEmit(saved: boolean) {
    this.onSaveConceptMappersEmitter.emit(true);
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

}

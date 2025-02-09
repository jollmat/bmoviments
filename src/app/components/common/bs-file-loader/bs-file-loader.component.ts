import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MovimentBSDTO } from 'src/app/model/dtos/moviment-BS-DTO';
import { MovimentBSEntity } from 'src/app/model/entities/moviment-BS-entity';
import { MovimentBSInterface } from 'src/app/model/interfaces/moviment-BS-interface';
import { AppUtils } from 'src/app/model/utils/app-utils';

import * as XLSX from 'xlsx';
import { ConceptsService } from 'src/app/services/concepts.service';
import { BankEntityInterface } from 'src/app/model/interfaces/bank-entity.interface';
import { BankEntitiesService } from 'src/app/services/bank-entities.service';
import { FileLoadedInterface } from 'src/app/model/interfaces/file-loaded.interface';
import { FileLoadedEntity } from 'src/app/model/entities/file-loaded.entity';
import { BankEntitySymbolEnum } from 'src/app/model/enums/bank-entity-symbol.enum';

type AOA = any[][];

@Component({
  selector: 'app-bs-file-loader',
  templateUrl: './bs-file-loader.component.html',
  styleUrls: ['./bs-file-loader.component.scss']
})
export class BSFileLoaderComponent {

  @Output() onFileLoadedEmitter = new EventEmitter< FileLoadedInterface>();
  @Output() onFileLoaderStartedEmitter = new EventEmitter<number>(); // Emits total files number
  @Output() onFileLoaderFinishedEmitter = new EventEmitter<number>(); // Emits loaded files number

  totalFiles: number = 0;
  totalFilesLoaded: number = 0;

  fileList: FileList;
  bankEntitiesList: BankEntityInterface[];

  constructor(
    private conceptsService: ConceptsService,
    private bankEntitiesService: BankEntitiesService
  ) { }

  onFileChange(evt: any) {
    console.log('BSFileLoaderComponent.onFileChange');

    this.bankEntitiesList = [];

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.fileList = target.files;

    this.totalFiles = this.fileList.length;
    this.totalFilesLoaded = 0;

    this.onFileLoaderStartedEmitter.emit(this.totalFiles);

    for (var i = 0; i < this.fileList.length; i++) {
      const bankEntity = this.bankEntitiesService.getBankEntityByFilename(this.fileList[i].name);
      this.bankEntitiesList.push(bankEntity);

      if (bankEntity) {
        this.readFile(this.fileList[i], bankEntity);
      } else {
        this.totalFilesLoaded++;
        this.onFileLoadedEmitter.emit(new FileLoadedEntity({
          filename: this.fileList[i],
          hasErrors: true,
          moviments: [],
          message: 'El nom del fitxer ' + this.fileList[i].name + ' no correspon a cap entitat suportada'
        }));
      }
    }
  }

  readFile(data: Blob, bankEntity: BankEntityInterface): void {
    const fileName: string = (data as any).name;
    
    console.log('Reading file ', fileName);

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* read workbook */
      const wb: XLSX.WorkBook = XLSX.read(e.target.result, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const fileRows = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));    

      let moviments: MovimentBSEntity[] = [];

      /* save data */
      for (let line of fileRows) {
        const moviment = this.processMoviment(line, bankEntity);
        if (moviment) {
          moviments.push(moviment);
        }
      }

      this.totalFilesLoaded++;

       if (moviments.length > 0) {
        this.onFileLoadedEmitter.emit(new FileLoadedEntity({
          filename: fileName,
          hasErrors: false,
          moviments: moviments,
          message: null
        }));
      } else {
        this.onFileLoadedEmitter.emit(new FileLoadedEntity({
          filename: fileName,
          hasErrors: true,
          moviments: [],
          message: 'El fitxer ' + fileName + ' no conté cap moviment vàlid'
        }));
      } 

      if (this.totalFilesLoaded === this.totalFiles) {
        this.onFileLoaderFinishedEmitter.emit(this.totalFilesLoaded);
      }
    };
    reader.readAsBinaryString(data);
  }

  processMoviment(line: any[], bankEntity: BankEntityInterface): MovimentBSInterface {
    console.log(line);
    if (line.length === bankEntity.templateNumCols && AppUtils.isDateFormat(line[0])) {
      let moviment: MovimentBSInterface;
      switch(bankEntity.symbol){
        case BankEntitySymbolEnum.BANC_SABADELL:
          moviment = MovimentBSDTO.toEntity(new MovimentBSDTO({
            id: null,
            dataOperacio: line[0],
            concepte: line[1],
            concepteOriginal: line[1],
            dataValor: line[2],
            importOperacio: line[3],
            saldo: line[4],
            referencia: line[5],
            referencia2: line[6],
            bankEntitySymbol: bankEntity.symbol,
            tags: []
          }));
          break;
        case BankEntitySymbolEnum.CAIXABANK:
          moviment = MovimentBSDTO.toEntity(new MovimentBSDTO({
            id: null,
            dataOperacio: line[0],
            concepte: line[2],
            concepteOriginal: line[2],
            dataValor: line[1],
            importOperacio: line[4],
            saldo: null,
            referencia: line[3],
            referencia2: '',
            bankEntitySymbol: bankEntity.symbol,
            tags: []
          }));
          break;
      }
      if (moviment) {
        this.conceptsService.applyConceptMapper(moviment);
      }
      return moviment || null;
    } else {
      return null;
    }
  }

}
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";

export class MovimentBSDTO {
    id: string | null;
    dataOperacio: string | null;
    concepte: string | null;
    concepteOriginal: string | null;
    dataValor: string | null;
    importOperacio: number | null;
    saldo: number | null;
    referencia: string | null;
    referencia2: string | null;
    bankEntitySymbol: string;
    tags?: string[];

    constructor ({
        id, 
        dataOperacio, 
        concepte, 
        concepteOriginal,
        dataValor, 
        importOperacio, 
        saldo, 
        referencia, 
        referencia2,
        bankEntitySymbol,
        tags
    }) {
        this.id = id;
        this.dataOperacio = dataOperacio;
        this.concepte = concepte;
        this.concepteOriginal = concepteOriginal;
        this.dataValor = dataValor;
        this.importOperacio = importOperacio;
        this.saldo = saldo;
        this.referencia = referencia;
        this.referencia2 = referencia2;
        this.bankEntitySymbol = bankEntitySymbol;
        this.tags = tags;
    }

    static toEntity(dto: MovimentBSDTO): MovimentBSInterface {
        return {
            id: dto.id, 
            dataOperacio: dto.dataOperacio, 
            concepte: dto.concepte, 
            concepteOriginal: dto.concepteOriginal,
            dataValor: dto.dataValor, 
            importOperacio: dto.importOperacio, 
            saldo: dto.saldo, 
            referencia: dto.referencia, 
            referencia2: dto.referencia2,
            synchronizing: false,
            bankEntitySymbol: dto.bankEntitySymbol,
            tags: dto.tags
        };
    }
}
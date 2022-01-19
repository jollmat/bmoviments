import { PointOptionsObject } from "highcharts";
import { MovimentBSDTO } from "../dtos/moviment-BS-DTO";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";
import { AppUtils } from "../utils/app-utils";

export class MovimentBSEntity implements MovimentBSInterface {
    id: string | null;
    dataOperacio: string | null;
    concepte: string | null;
    concepteOriginal: string | null;
    dataValor: string | null;
    importOperacio: number | null;
    saldo: number | null;
    referencia: string | null;
    referencia2: string | null;
    synchronizing: boolean | null;
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
        synchronizing,
        bankEntitySymbol,
        tags,    
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
        this.synchronizing = synchronizing;
        this.bankEntitySymbol = bankEntitySymbol;
        this.tags = tags;
    }

    static toDTO(entity: MovimentBSEntity): MovimentBSDTO {
        return {
            id: entity.id, 
            dataOperacio: entity.dataOperacio, 
            concepte: entity.concepte, 
            concepteOriginal: entity.concepteOriginal,
            dataValor: entity.dataValor, 
            importOperacio: entity.importOperacio, 
            saldo: entity.saldo, 
            referencia: entity.referencia, 
            referencia2: entity.referencia2,
            bankEntitySymbol: entity.bankEntitySymbol,
            tags: entity.tags
        };
    }

    static getGroupedPointOptions(moviments: MovimentBSInterface[]): { input: PointOptionsObject[], output: PointOptionsObject[] } {
        const grouped = {
            input: [],
            output: []
        };

        let ingressosAll: Highcharts.PointOptionsObject[] = [];
        let despesesAll: Highcharts.PointOptionsObject[] = [];

        moviments.forEach((m) => {
            if (m.importOperacio > 0) {
                const idx = ingressosAll.findIndex((_m) => { return m.concepte === _m.name; });
                if (idx > -1) {
                    ingressosAll[idx].value += m.importOperacio;
                } else {
                    ingressosAll.push({name: m.concepte, value: m.importOperacio});
                }
            } else {
                const idx = despesesAll.findIndex((_m) => { return m.concepte === _m.name; });
                if (idx > -1) {
                    despesesAll[idx].value += Math.abs(m.importOperacio);
                } else {
                    despesesAll.push({name: m.concepte, value: Math.abs(m.importOperacio)});
                }
            }
        });

        ingressosAll = AppUtils.sortArrayBy(ingressosAll, 'value', false);
        despesesAll = AppUtils.sortArrayBy(despesesAll, 'value', false);

        grouped.input = ingressosAll;
        grouped.output = despesesAll;

        return grouped;
    }
}
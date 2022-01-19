export interface MovimentBSInterface {
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
}
export class BankEntityEntity {
    name: string;
    symbol: string;
    templateNumCols: number;
    templateFilePrefix: string;

    constructor ({name, symbol, templateNumCols, templateFilePrefix}) {
        this.name = name;
        this.symbol = symbol;
        this.templateNumCols = templateNumCols;
        this.templateFilePrefix = templateFilePrefix;
    }
}
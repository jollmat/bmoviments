import { FileLoadedInterface } from "../interfaces/file-loaded.interface";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";

export class FileLoadedEntity implements FileLoadedInterface {
    filename: string;
    moviments: MovimentBSInterface[];
    hasErrors: boolean;
    message?: string;

    constructor ({filename, moviments, hasErrors, message}) {
        this.filename = filename;
        this.moviments = moviments;
        this.hasErrors = hasErrors;
        this.message = message;
    }
}
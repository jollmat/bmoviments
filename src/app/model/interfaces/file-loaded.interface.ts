import { MovimentBSInterface } from "./moviment-BS-interface";

export interface FileLoadedInterface {
    filename: string;
    moviments: MovimentBSInterface[];
    hasErrors: boolean;
    message?: string;
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IGNORED_CONCEPTS } from '../model/constants/ignored-concepts.constant';
import { MovimentBSInterface } from '../model/interfaces/moviment-BS-interface';
import { MovimentBSDTO } from '../model/dtos/moviment-BS-DTO';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
    replaceableStrings: Array<string[]>;
    removableStrings: string[];
    demoMode: boolean = false;

    actionInCourse$ = new BehaviorSubject<boolean>(false);

    constructor(public http: HttpClient) {

        this.replaceableStrings = [
            ['ADEUDO RECIBO', 'REBUT']
        ];

        this.removableStrings = [
            'COMPRA TARJ. 5402XXXXXXXX9018 '
        ];

    }

    isDemo(): boolean {
        return this.demoMode;
    }

    setDemo(isDemo: boolean) {
        this.demoMode = isDemo;
    }

    getStorageKey () {
        return (this.isDemo()) ? 'bs-moviments-demo' : 'bs-moviments';
    }
    
    excludeIgnoredMoviments(moviments: MovimentBSInterface[] | MovimentBSDTO[] ): MovimentBSInterface[] | MovimentBSDTO[] {
        return moviments.filter((m) => {
            return IGNORED_CONCEPTS.indexOf(m.concepte) === -1;
        });
    }
}
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrompterService {

  message: Subject<string | undefined> = new Subject<string | undefined>();

  constructor() {
    this.prompt(undefined);
  }

  public prompt(msg: string | undefined, duration?: number): void {
    this.message.next(msg);
    if (duration) {
      setTimeout(() => {
        this.message.next(undefined);
      }, duration);
    }
  }
}

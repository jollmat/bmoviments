import { Injectable } from '@angular/core';

import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import * as uuid from 'uuid';
import { MovimentBSDTO } from '../model/dtos/moviment-BS-DTO';
import { ApplicationService } from './application-service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore,
    private appService: ApplicationService
  ) { }

  getMoviments (): Observable<MovimentBSDTO[]> {

    if(this.appService.isDemo()){
      return of([]);
    }

    console.log(' -> firebaseService.getMoviments()');

    return this.firestore.collection('moviments').valueChanges() as Observable<MovimentBSDTO[]>;
  }

  syncMoviment (m: MovimentBSDTO): Observable<DocumentReference>{

    if(this.appService.isDemo()){
      return of(undefined);
    }

    console.log(' -> firebaseService.syncMoviment()');

    m.id = uuid.v1();
    return from(this.firestore.collection('moviments').add(m));
  }

  syncMoviments (mm: MovimentBSDTO[]): Observable<void> {

    if(this.appService.isDemo()){
      return of(undefined);
    }

    console.log(' -> firebaseService.syncMoviments()');

    const batch = this.firestore.firestore.batch();
    const moviments = mm.map((obj)=> {return Object.assign({}, obj)});

    moviments.forEach((m) => {
      m.id = uuid.v1();
      const mRef = this.firestore.collection('moviments').doc(m.id);
      batch.set(mRef.ref, m);
    });
    return from(batch.commit());   
  }

  deleteMoviment (movimentId: string): Observable<void> {
    
    if(this.appService.isDemo()){
      return of(undefined);
    }

    console.log(' -> firebaseService.deleteMoviment(' + movimentId + ')');

    return from(this.firestore.collection('moviments').doc(movimentId).delete());
  }

  deleteMoviments (movimentsIds: string[]): Observable<void> {

    if(this.appService.isDemo()){
      return of(undefined);
    }
    
    console.log(' -> firebaseService.deleteMoviments(' + movimentsIds.length + ')');
    
    const batch = this.firestore.firestore.batch();

    movimentsIds.forEach((id) => {
        const mRef = this.firestore.collection('moviments').doc(id);
        batch.delete(mRef.ref);
    });

    return from(batch.commit());
  }

}

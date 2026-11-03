import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';

@Injectable({ providedIn: 'root' })
export class FirebaseAppService {
  private readonly app: FirebaseApp = initializeApp(firebaseConfig);

  getApp(): FirebaseApp {
    return this.app;
  }
}

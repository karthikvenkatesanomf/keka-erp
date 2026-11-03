import { Injectable, signal, inject } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import {
  User,
  UserCredential,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { FirebaseAppService } from '../../firebase/firebase-app';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private firebaseApp = inject(FirebaseAppService);
  private readonly auth = getAuth(this.firebaseApp.getApp());
  private readonly user = signal<User | null>(null);

  readonly currentUser = this.user.asReadonly();

  constructor() {
    onAuthStateChanged(this.auth, (user) => this.user.set(user));
  }

  async isAuthenticated(): Promise<boolean> {
    await this.auth.authStateReady();
    return this.auth.currentUser !== null;
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: unknown) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  private getErrorMessage(error: unknown): string {
    if (!(error instanceof FirebaseError)) {
      return 'Unable to sign in. Please try again.';
    }

    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'The email address or password is incorrect.';
      case 'auth/invalid-email':
        return 'Enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'A network error occurred. Check your connection and try again.';
      default:
        return 'Unable to sign in. Please try again.';
    }
  }
}

import {
  Firestore,
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
} from 'firebase/firestore';
import { inject } from '@angular/core';
import { FirebaseAppService } from '../firebase/firebase-app';

export abstract class FirestoreService {
  protected firebaseApp = inject(FirebaseAppService);
  protected readonly firestore: Firestore = getFirestore(this.firebaseApp.getApp());
  protected abstract collectionName: string;

  async getAll(): Promise<Array<{ id: string; [key: string]: unknown }>> {
    try {
      const querySnapshot = await getDocs(
        collection(this.firestore, this.collectionName)
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Failed to fetch from ${this.collectionName}: ${this.getErrorMessage(error)}`);
    }
  }

  async getById(docId: string): Promise<{ id: string; [key: string]: unknown } | null> {
    try {
      const docSnap = await getDoc(
        doc(this.firestore, this.collectionName, docId)
      );
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to fetch from ${this.collectionName}: ${this.getErrorMessage(error)}`);
    }
  }

  async create(data: Record<string, unknown>): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(this.firestore, this.collectionName),
        data
      );
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create in ${this.collectionName}: ${this.getErrorMessage(error)}`);
    }
  }

  async update(
    docId: string,
    data: Record<string, unknown>
  ): Promise<void> {
    try {
      await updateDoc(
        doc(this.firestore, this.collectionName, docId),
        data
      );
    } catch (error) {
      throw new Error(`Failed to update in ${this.collectionName}: ${this.getErrorMessage(error)}`);
    }
  }

  async delete(docId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, this.collectionName, docId));
    } catch (error) {
      throw new Error(`Failed to delete from ${this.collectionName}: ${this.getErrorMessage(error)}`);
    }
  }

  async queryDocuments(
    fieldPath: string,
    opStr: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any',
    value: unknown
  ): Promise<Array<{ id: string; [key: string]: unknown }>> {
    try {
      const q: Query = query(
        collection(this.firestore, this.collectionName),
        where(fieldPath, opStr, value)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw new Error(`Failed to query ${this.collectionName}: ${this.getErrorMessage(error)}`);
    }
  }

  protected getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  }
}

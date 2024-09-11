import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, Query, orderBy, limit, startAfter } from '@angular/fire/firestore';
import { Observable, from, observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly pageSize = 30;
  private lastDoc: any = null;

  constructor(private firestore: Firestore) {}

  searchMovies(keyword: string, lastDoc?: any): Observable<any[]> {
    const moviesCollectionRef = collection(this.firestore, 'posts');
    let searchQuery = query(
      moviesCollectionRef,
      where('moviename', '>=', keyword),
      where('moviename', '<=', keyword + '\uf8ff'),
      orderBy('moviename'),
      limit(this.pageSize)
    );

    if (lastDoc) {
      searchQuery = query(searchQuery, startAfter(lastDoc));
    }

    return from(getDocs(searchQuery).then(snapshot => {
      this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }));
  }

  getAllMovies(lastDoc?: any): Observable<any[]> {
    const moviesCollection = collection(this.firestore, 'posts');
    let q = query(moviesCollection, orderBy('moviename'), limit(this.pageSize));

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }


    return from(getDocs(q)).pipe(
      map(snapshot => {
        this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      })
    );
  }

  getMoviesByCategory(category: string, lastDoc?: any): Observable<any[]> {
    const moviesCollection = collection(this.firestore, 'posts');
    let q = query(
      moviesCollection,
      where('subcategory', '==', category.toLowerCase()), // Convert to lowercase
    );
  
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
  
    return from(getDocs(q)).pipe(
      map(snapshot => {
        this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      })
    );
  }

  getMovieByTitle(title: string): Observable<any | null> {
    const moviesCollection = collection(this.firestore, 'posts');
    const q = query(moviesCollection, where('title', '==', title));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.docs.length > 0) {
          const doc = snapshot.docs[0];
          return { id: doc.id, ...doc.data() };
        }
        return null;
      })
    );
  }

  setLastDoc(doc: any) {
    this.lastDoc = doc;
  }

  getLastDoc() {
    return this.lastDoc;
  }

  resetLastDoc() {
    this.lastDoc = null;
  }
}
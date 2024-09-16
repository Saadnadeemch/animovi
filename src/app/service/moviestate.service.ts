import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MoviestateService {
  private moviesSubject = new BehaviorSubject<any[]>([]);
  movies$ = this.moviesSubject.asObservable();

  private lastDocSubject = new BehaviorSubject<any>(null);
  lastDoc$ = this.lastDocSubject.asObservable();

  private searchTermSubject: BehaviorSubject<string>;
  searchTerm$: Observable<string>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    const initialSearchTerm = this.getInitialSearchTerm();
    this.searchTermSubject = new BehaviorSubject<string>(initialSearchTerm);
    this.searchTerm$ = this.searchTermSubject.asObservable();
  }

  private getInitialSearchTerm(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('searchTerm') || '';
    }
    return '';
  }

  updateMovies(movies: any[]): void {
    this.moviesSubject.next(movies);
  }

  updateLastDoc(lastDoc: any): void {
    this.lastDocSubject.next(lastDoc);
  }

  updateSearchTerm(term: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('searchTerm', term);
    }
    this.searchTermSubject.next(term);
  }

  clear(): void {
    this.moviesSubject.next([]);
    this.lastDocSubject.next(null);
    this.updateSearchTerm('');
  }
}
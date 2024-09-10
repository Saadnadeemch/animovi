// movie-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviestateService {
  private moviesSubject = new BehaviorSubject<any[]>([]);
  movies$ = this.moviesSubject.asObservable();

  private lastDocSubject = new BehaviorSubject<any>(null);
  lastDoc$ = this.lastDocSubject.asObservable();

  updateMovies(movies: any[]) {
    this.moviesSubject.next(movies);
  }

  updateLastDoc(lastDoc: any) {
    this.lastDocSubject.next(lastDoc);
  }

  clear() {
    this.moviesSubject.next([]);
    this.lastDocSubject.next(null);
  }

  
}
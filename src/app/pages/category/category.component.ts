import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { PostService } from '../../service/post.service';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { Observable, Subscription, of } from 'rxjs';
import { MoviestateService } from '../../service/moviestate.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { catchError, tap, filter, take } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchbarComponent],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  category: string | null = null;
  isLoading: boolean = false;
  searchTerm: string = '';
  allMoviesLoaded: boolean = false;
  showGoToTopButton: boolean = false;
  private subscriptions: Subscription[] = [];
  isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private movieStateService: MoviestateService,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.setupNavigationHandling();
    this.setupRouteHandling();
    this.loadInitialMovies();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupNavigationHandling(): void {
    this.subscriptions.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        if (this.location.path().includes('/category')) {
          this.loadMovies(true);
        }
      })
    );
  }

  private setupRouteHandling(): void {
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        const newCategory = params.get('category');
        if (this.category !== newCategory) {
          this.category = newCategory;
          this.resetMovies();
          this.loadMovies(true);
        }
      })
    );
  }

  private loadInitialMovies(): void {
    this.movieStateService.movies$.pipe(
      take(1)
    ).subscribe(movies => {
      if (movies.length > 0) {
        this.movies = movies;
      } else {
        this.loadMovies(true);
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isBrowser) {
      const scrollPosition = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      this.showGoToTopButton = scrollPosition > 200;

      if ((window.innerHeight + scrollPosition) >= (document.documentElement.offsetHeight - 200) && !this.isLoading && !this.allMoviesLoaded) {
        this.loadMovies();
      }
    }
  }

  resetMovies() {
    this.movies = [];
    this.allMoviesLoaded = false;
    this.postService.resetLastDoc();
    this.movieStateService.clear();
  }

  loadMovies(isInitialLoad: boolean = false): void {
    if (this.isLoading || this.allMoviesLoaded) return;

    this.isLoading = true;
    const lastDoc = isInitialLoad ? null : this.postService.getLastDoc();
    let observable: Observable<any[]>;

    if (this.searchTerm) {
      observable = this.postService.searchMovies(this.searchTerm, lastDoc);
    } else if (this.category) {
      const formattedCategory = this.category.replace(/-/g, ' ').toLowerCase();
      observable = this.postService.getMoviesByCategory(formattedCategory, lastDoc);
    } else {
      observable = this.postService.getAllMovies(lastDoc);
    }

    observable.pipe(
      tap(newMovies => {
        if (isInitialLoad) {
          this.movies = newMovies;
        } else {
          this.movies = [...this.movies, ...newMovies];
        }
        this.movieStateService.updateMovies(this.movies);
        this.movieStateService.updateLastDoc(this.postService.getLastDoc());
        this.isLoading = false;
        if (newMovies.length === 0) {
          this.allMoviesLoaded = true;
        }
      }),
      catchError(error => {
        console.error('Error loading movies:', error);
        this.isLoading = false;
        return of([]);
      })
    ).subscribe();
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.resetMovies();
    this.loadMovies(true);
  }

  navigateToMovie(movieTitle: string): void {
    this.router.navigate(['/movie', movieTitle]);
  }

  scrollToTop() {
    if (this.isBrowser) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
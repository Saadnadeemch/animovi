import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, NavigationEnd } from '@angular/router';
import { PostService } from '../../service/post.service';
import { SearchbarComponent } from '../../components/searchbar/searchbar.component';
import { Observable, Subscription } from 'rxjs';
import { MoviestateService } from '../../service/moviestate.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

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
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const currentUrl = this.router.url;
          const previousUrl = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString();

          if (previousUrl && previousUrl.includes('/movie') && currentUrl !== previousUrl) {
            if (this.isBrowser) {
              this.document.defaultView?.location.reload();
            }
          }
        }
      })
    );

    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        this.category = params.get('category');
        this.resetMovies();
        this.loadMovies();
      })
    );

    // Load stored movies if available
    this.subscriptions.push(
      this.movieStateService.movies$.subscribe(movies => {
        if (movies.length > 0) {
          this.movies = movies;
        }
      })
    );

    this.subscriptions.push(
      this.movieStateService.lastDoc$.subscribe(lastDoc => {
        if (lastDoc) {
          this.postService.setLastDoc(lastDoc);
        }
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.isBrowser) {
      const scrollPosition = this.document.documentElement.scrollTop || this.document.body.scrollTop;
      this.showGoToTopButton = scrollPosition > 200;

      if ((this.document.documentElement.clientHeight + scrollPosition) >= this.document.body.offsetHeight - 200 && !this.isLoading && !this.allMoviesLoaded) {
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

  loadMovies(): void {
    if (this.isLoading || this.allMoviesLoaded) return;

    this.isLoading = true;
    const lastDoc = this.postService.getLastDoc();
    let observable: Observable<any[]>;

    if (this.searchTerm) {
      observable = this.postService.searchMovies(this.searchTerm, lastDoc);
    } else if (this.category) {
      const formattedCategory = this.category.replace(/-/g, ' ').toLowerCase();
      observable = this.postService.getMoviesByCategory(formattedCategory, lastDoc);
    } else {
      observable = this.postService.getAllMovies(lastDoc);
    }

    observable.subscribe(
      newMovies => {
        this.movies = [...this.movies, ...newMovies];
        this.movieStateService.updateMovies(this.movies);
        this.movieStateService.updateLastDoc(this.postService.getLastDoc());
        this.isLoading = false;
        if (newMovies.length === 0) {
          this.allMoviesLoaded = true;
        }
      },
      error => {
        console.error('Error loading movies:', error);
        this.isLoading = false;
      }
    );
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.resetMovies();
    this.loadMovies();
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
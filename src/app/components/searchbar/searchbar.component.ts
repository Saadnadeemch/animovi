import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MoviestateService } from '../../service/moviestate.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit, OnDestroy {
  @Input() category: string | null = null;
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private subscription: Subscription | null = null;

  constructor(private movieStateService: MoviestateService) {}

  ngOnInit() {
    this.subscription = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.movieStateService.updateSearchTerm(term);
      this.search.emit(term);
    });

    this.movieStateService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get searchBarText(): string {
    if (this.searchTerm) {
      return `You searched for "${this.searchTerm}"`;
    } else if (this.category) {
      return `Latest results for "${this.category}"`;
    } else {
      return 'Latest Posts From Animovie';
    }
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
    
    if (!value) {
      this.clear.emit();
    }
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.search.emit(this.searchTerm.trim());
    }
  }

  pasteText(): void {
    navigator.clipboard.readText().then(
      clipText => {
        this.searchTerm = clipText;
        this.searchSubject.next(clipText);
      }
    ).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
  }
}
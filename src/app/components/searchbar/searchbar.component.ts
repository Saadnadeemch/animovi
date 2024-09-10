import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent {
  @Input() category: string | null = null;
  @Input() searchTerm: string = '';
  @Output() search = new EventEmitter<string>();

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
    const input = event.target as HTMLInputElement;
    if (input) {
      this.searchTerm = input.value;
      this.search.emit(this.searchTerm);
    }
  }
  pasteText(): void {
    navigator.clipboard.readText().then(
      clipText => this.searchTerm = clipText
    ).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
  }
}

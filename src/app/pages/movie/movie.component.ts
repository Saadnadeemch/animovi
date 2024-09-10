import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../../service/post.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';  

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movie: any = {};
  imageLoaded: boolean = false;
  safeUrl: SafeResourceUrl | undefined;
  safeUrls: SafeResourceUrl | undefined;
  Thirdmovi: SafeResourceUrl | undefined;
  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private titleService: Title,  
    private metaService: Meta     
  ) {}

  ngOnInit(): void {
    const movieTitle = this.route.snapshot.paramMap.get('title');
    if (movieTitle) {
      this.postService.getMovieByTitle(movieTitle).subscribe(data => {
        this.movie = data;

        if (this.movie.title) {
          this.titleService.setTitle(this.movie.title);
        }

        if (this.movie.description) {
          this.metaService.updateTag({ name: 'description', content: this.movie.description });
        }

        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.dood);
        this.safeUrls = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.moon);
        this.Thirdmovi = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.thirdvideo)
      });
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PostService } from '../../service/post.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Title, Meta } from '@angular/platform-browser';

interface VideoServer {
  id: number;
  name: string;
  url: SafeResourceUrl;
  note: string;
}

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {
  movie: any = {};
  imageLoaded: boolean = false;
  videoServers: VideoServer[] = [];
  activeTab = 1;

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

        this.setupVideoServers();
      });
    }
  }

  setupVideoServers(): void {
    this.videoServers = [
      {
        id: 1,
        name: 'Server 1',
        url: this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.dood),
        note: ''
      },
      {
        id: 2,
        name: 'Server 2',
        url: this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.thirdvideo),
        note: 'NOTE: if the video doesn\'t load, please click the link in the center of the video'
      },
      {
        id: 3,
        name: 'Server 3',
        url: this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.moon),
        note: 'NOTE: Click more than 3 times to start the video and wait 10 seconds'
      }
    ];
  }

  setActiveTab(tabId: number): void {
    this.activeTab = tabId;
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }
}
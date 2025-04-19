import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { ArtistDetailsComponent } from '../../components/artist-details/artist-details.component';
import { ArtistListComponent } from '../../components/artist-list/artist-list.component';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, ArtistDetailsComponent, ArtistListComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  artists: Artist[] | null = null;
  selected_artist: string | null = null;
  private routeSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        this.selected_artist = params.get('id');
        return []; 
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  handleMessage_searchForm(artists : Artist[] | null) {
    if(artists === null) {
      this.artists = null;
      this.selected_artist = null;
      this.router.navigate(['/']);
    }
    this.artists = artists;
  }
  handleMessage_artistLists(artist_id : string) {
    this.selected_artist = artist_id;
  }
}
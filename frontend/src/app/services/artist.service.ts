import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { Artist } from '../models/artist.model';
import { Artwork } from '../models/artwork.model';
import { Favorite } from '../models/favorite.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiService = inject(ApiService);

  searchArtists(query: string): Observable<Artist[]> {
    return this.apiService.searchArtists(query).pipe(
      map((response: any) => {
        return response.map((artist: any) => ({
          id: artist.id,
          name: artist.title,
          thumbnail: artist.pic_url=="/assets/shared/missing_image.png" ? "assets/artsy_logo.svg" : artist.pic_url
        }));
      })
    );
  }

  getArtistDetails(id: string): Observable<Artist> {
    return this.apiService.getArtist(id).pipe(
      map((artist: any) => ({
        id: artist.id,
        name: artist.name,
        birthday: artist.birthday,
        deathday: artist.deathday,
        nationality: artist.nationality,
        biography: artist.biography
      }))
    );
  }

  getSimilarArtists(artistId: string): Observable<Artist[]> {
    return this.apiService.getSimilarArtists(artistId).pipe(
      map((response: any) => {
        return response.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          thumbnail: artist.pic_url=="/assets/shared/missing_image.png" ? "assets/artsy_logo.svg" : artist.pic_url
        }));
      })
    );
  }

  getArtworks(artistId: string): Observable<Artwork[]> {
    return this.apiService.getArtistArtworks(artistId).pipe(
      map((response: any) => {
        return response.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.title,
          thumbnail: artwork.pic_url,
          date: artwork.date
        }));
      })
    );
  }

  getCategories(artworkId: string): Observable<Category[]> {
    return this.apiService.getArtworkCategories(artworkId).pipe(
      map((response: any) => {
        return response.map((category: any) => ({
          id: category.id,
          name: category.name,
          thumbnail: category.pic_url
        }));
      })
    );
  }

  convertToFavorite(artist: Artist): Favorite {
    return {
      artistId: artist.id,
      artistName: artist.name,
      birthday: artist.birthday,
      deathday: artist.deathday,
      nationality: artist.nationality,
      thumbnail: artist.thumbnail,
      addedAt: new Date() // Add the required addedAt field
    };
  }
}
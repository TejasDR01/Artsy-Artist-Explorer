import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  searchArtists(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artists/search?keyword=${query}`);
  }

  getArtist(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artists?id=${id}`);
  }

  getSimilarArtists(artistId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artists/similar?id=${artistId}`);
  }

  getArtistArtworks(artistId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artists/artworks?id=${artistId}`);
  }

  getArtworkCategories(artworkId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artists/artworks/genes?id=${artworkId}`);
  }
}
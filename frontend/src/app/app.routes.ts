import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Artist Search' },
  { path: 'artist/:id', component: HomeComponent, title: 'Artist Details' },
  { path: 'login', component: LoginComponent, title: 'Login', canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, title: 'Register', canActivate: [guestGuard] },
  { path: 'favorites', component: FavoritesComponent, title: 'Favorites', canActivate: [authGuard] },
  { path: '**', redirectTo: '/' }
];
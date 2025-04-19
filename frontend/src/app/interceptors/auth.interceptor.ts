import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  if (req.url.includes('/auth/') || authService.isLoggedIn()) {
    const authReq = req.clone({
      withCredentials: true
    });
  
    return next(authReq);
  }
  return next(req);
};
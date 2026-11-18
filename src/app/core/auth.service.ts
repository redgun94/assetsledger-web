import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse, LoginRequest} from '../features/auth/auth.models';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';


const TOKEN_KEY = 'assetsledger.token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  readonly isLoggedIn = signal(this.getToken() !== null);

  login(credentials : LoginRequest): Observable<AuthResponse>{


    const apiUrl = `${environment.apiUrl}/auth/login`;
    return this.http.post<AuthResponse>(apiUrl,credentials).pipe(
      tap(response => {
        localStorage.setItem(TOKEN_KEY,response.accessToken);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout(): void{
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedIn.set(false);
  }
  getToken():string | null{
    return localStorage.getItem(TOKEN_KEY)
  }
}

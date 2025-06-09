import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { SigninCredentialsResponse } from '../models/auth';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { LoggedUser } from '../../modules/shared/models/LoggedUser.interrface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private storage = inject(StorageService);
  private http = inject(HttpClient);

  private readonly api = environment.api;

  protected user: WritableSignal<SigninCredentialsResponse> = signal<SigninCredentialsResponse>({});

  decodeAndNotify(user: SigninCredentialsResponse) {
    this.storage.saveToken(user?.token);
    this.user.set(user.user);
  }

  getLoggedUser():Observable<LoggedUser> {
    return this.http.get<LoggedUser>(`${this.api}/auth/me`).pipe(
      tap((res) => {
        this.storage.setItem('userId', res.id);
      })
    );
  }
}

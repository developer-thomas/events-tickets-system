import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { AdminLoginResponse, SigninCredentialsResponse } from '../models/auth';
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
  
  private _permissions: string[] = [];

  protected user: WritableSignal<SigninCredentialsResponse> = signal<SigninCredentialsResponse>({});

  public clearAdminData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('permissions');
    localStorage.removeItem('adminId');
    localStorage.removeItem('name');
  }

  public clearClientData() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  }

  decodeAndNotifyUser(user: SigninCredentialsResponse) {
    this.clearAdminData(); 
    this.storage.saveUserToken(user?.token);
    localStorage.setItem('role', 'CLIENT');
    // localStorage.setItem('role', );
    this.user.set(user);
  }

  decodeAndNotify(user: AdminLoginResponse) {
    this.clearClientData(); 
    this.storage.saveToken(user?.token);
    localStorage.setItem('role', user.role);
    localStorage.setItem('adminId', user.id.toString());
    localStorage.setItem('name', user.name.toString());
    this.user.set(user);

    this._permissions = user.permissions;
    localStorage.setItem('permissions', JSON.stringify(user.permissions));
  }

  getLoggedUser():Observable<LoggedUser> {
    return this.http.get<LoggedUser>(`${this.api}/auth/me`).pipe(
      tap((res) => {
        this.storage.setItem('userId', res.id);
      })
    );
  }

  getPermissions(): string[] {
    if (this._permissions.length) return this._permissions;

    const localPermissions = localStorage.getItem('permissions');
    return localPermissions ? JSON.parse(localPermissions) : [];
  }
  
}

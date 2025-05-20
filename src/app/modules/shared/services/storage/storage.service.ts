import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly KEY = 'authToken';

  public getToken() {
    return localStorage.getItem(this.KEY);
  }

  public setToken(token: string) {
    localStorage.setItem(this.KEY, token);
  }

  public removeToken() {
    localStorage.removeItem(this.KEY);
  }
}

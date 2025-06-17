import { Injectable } from '@angular/core';
const KEY = 'authToken';

@Injectable({
  providedIn: 'root',
})
export class StorageService {  

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string) {
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;
    } catch {
      return item;
    }
  }

  saveToken(token?: string) {
    localStorage.setItem(KEY, token || '');
  }

  saveUserToken(token?: string) {
    localStorage.setItem('userToken', token || '');
  }

  getToken() {
    return localStorage.getItem(KEY);
  }

  getUserToken() {
    return localStorage.getItem('userToken');
  }

  hasToken() {
    return !!this.getToken();
  }

  getRole(): string | null {
    const role = localStorage.getItem('role');
    if (!role) return null;
    
    try {
      const parsedRole = JSON.parse(role);
      return parsedRole === 'ADMIN' || parsedRole === 'CLIENT' ? parsedRole : null;
    } catch {
      return role === 'ADMIN' || role === 'CLIENT' ? role : null;
    }
  }

}

import { Injectable, WritableSignal, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { SigninCredentialsResponse } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected user: WritableSignal<SigninCredentialsResponse> =
    signal<SigninCredentialsResponse>({});
  constructor(private storage: StorageService) {}

  decodeAndNotify(user: SigninCredentialsResponse) {
    this.storage.saveToken(user?.token);
    this.user.set(user.user);
  }
}

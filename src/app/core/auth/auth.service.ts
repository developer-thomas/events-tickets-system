import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { SigninCredentialsResponse } from "../models/auth";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userService = inject(UserService);

  private readonly api = environment.api;

  auth( email: string, password: string ): Observable<SigninCredentialsResponse> {
    return this.http.post<SigninCredentialsResponse>(
        `${this.api}/auth`,
        {
          email,
          password,
        }
      )
      .pipe(tap((user) => this.userService.decodeAndNotify(user)));
  }

  forgot(email: string | null): Observable<any> {
    return this.http.post<SigninCredentialsResponse>(
      `${this.api}/auth/forgot`,
      {
        email,
      }
    );
  }

  reset({ code, password, confirmPassword }: any): Observable<any> {
    return this.http.post<SigninCredentialsResponse>(
      `${this.api}/auth/reset`,
      {
        code,
        password,
        confirmPassword,
      }
    );
  }

  concactUs(contact: any): Observable<any> {
    return this.http.post<any>(
      `${this.api}/v1/noAuth/contactUs`,
      contact
    );
  }
}

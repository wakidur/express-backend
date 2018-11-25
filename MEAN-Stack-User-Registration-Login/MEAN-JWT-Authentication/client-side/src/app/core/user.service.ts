import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/Operators";

import { CoreModule } from "./core.module";
import { User } from "./userModel";
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: CoreModule
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  /**
   * postUser
   */
  public postUser(user: User) {
    return this.httpClient.post(environment.apiBaseUrl + "/signup", user);
  }

  public addHero(hero: User): Observable<User> {
    return this.httpClient
      .post<User>(environment.apiBaseUrl + "/signup", hero);
  }

}

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { CoreModule } from "./core.module";
import { User } from "./userModel";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: CoreModule
})
export class UserService {
  messages: string[] = [];
  private heroesUrl = environment.apiBaseUrl;  // URL to web api

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
  constructor(private httpClient: HttpClient) {}

  /**
   * postUser
   */

  public postUser(user: User) {
    return this.httpClient.post(environment.apiBaseUrl + "/signup", user);
  }


  //////// Save methods //////////
  /** POST: add a new hero to the server */
  addHero(hero: User): Observable<User> {
    return this.httpClient.post<User>(this.heroesUrl, hero);
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.add(`HeroService: ${message}`);
  }
}

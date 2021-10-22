import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClientDetail } from 'src/app/models/client-detail';
import { UiCacheStore } from 'src/app/models/ui-cache-store';
import { UserAuthentication } from 'src/app/models/user-auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<UserAuthentication>;
  public currentUser: Observable<UserAuthentication>;


  private clientsSubject: BehaviorSubject<ClientDetail[]>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject(UiCacheStore.fromCache('CurrentUser'));
    this.currentUser = this.currentUserSubject.asObservable();

    this.clientsSubject = new BehaviorSubject(UiCacheStore.fromCache('ClientsDetail'));
  }

  currentUserValue(): UserAuthentication {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<UserAuthentication> {
    const userAuth: UserAuthentication = { ntlg: username, password: password };
    return this.http.post<any>(`${environment.apiUrl}/userAuthentication`, userAuth)
      .pipe(map(arrObj => {
        let clientsDetail: ClientDetail[] = [];
        arrObj.forEach(element => {
          const cObj: ClientDetail = new Object();
          if (element.hasOwnProperty('clientID'))
            cObj.clientId = element.clientID;
          if (element.hasOwnProperty('clientName'))
            cObj.clientName = element.clientName;
          clientsDetail.push(cObj);
        });

        this.clientsSubject.next(clientsDetail);
        UiCacheStore.toCache('ClientsDetail', clientsDetail);

        if (clientsDetail.length > 0) {
          UiCacheStore.toCache('CurrentUser', userAuth);
          this.currentUserSubject.next(userAuth);
          return userAuth;
        }
        return null;
      }));
  }

  logout() {
    UiCacheStore.purgeCache();
    this.currentUserSubject.next(null);
  }
}

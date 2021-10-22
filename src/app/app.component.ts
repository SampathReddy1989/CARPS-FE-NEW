import { Component } from '@angular/core';
import { AccessMasterOperations } from './models/access-master-operations';
import { ClientDetail } from './models/client-detail';
import { UserAuthentication } from './models/user-auth';
import { UiCacheStore } from './models/ui-cache-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CARPS';

  static getCurrentUser(): UserAuthentication {
    return UiCacheStore.fromCache('CurrentUser');
  }

  static getCurrentClient(): ClientDetail {
    return UiCacheStore.fromCache('CurrentClient');
  }

  static getClientsMapped(): ClientDetail[] {
    return UiCacheStore.fromCache('ClientsDetail');
  }

  static currentTimeStamp(): string {
    const today = new Date();
    return today.toDateString() + ' ' + today.toTimeString();
  }
}

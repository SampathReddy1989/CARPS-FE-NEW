import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser: string;
  currentClient: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    if (AppComponent.getCurrentUser())
      this.currentUser = AppComponent.getCurrentUser().ntlg;
    if (AppComponent.getCurrentClient())
      this.currentClient = AppComponent.getCurrentClient().clientName;
  }

}

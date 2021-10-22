import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCoffee,
  faBriefcase,
  faBoxes,
  faFileImport,
  faIdBadge,
  faPortrait,
  faFileAlt,
  faAsterisk,
  faDice,
  faStream,
  faBell,
  faUser,
  faFire,
  faMapSigns,
  faProjectDiagram
}
  from '@fortawesome/free-solid-svg-icons';
import { UiCacheStore } from 'src/app/models/ui-cache-store';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  faCoffee = faCoffee;
  faBriefcase = faBriefcase;
  faBoxes = faBoxes;
  faFileImport = faFileImport;
  faIdBadge = faIdBadge;
  faPortrait = faPortrait;
  faFileAlt = faFileAlt;
  faAsterisk = faAsterisk;
  faDice = faDice;
  faStream = faStream;
  faBell = faBell;
  faUser = faUser;
  faFire = faFire;
  faMapSigns = faMapSigns;
  faProjectDiagram = faProjectDiagram;


  constructor(private router: Router) { }

  ngOnInit() {
    if (this.router.url === '/home/dashboard')
      UiCacheStore.toCache('NavActive', 'Dashboard');
  }

  onNavClick(val: string) {
    UiCacheStore.toCache('NavActive', val);
  }

  getNavActive(item: string): string {
    let style: string = 'not-active-link';
    let navActive = UiCacheStore.fromCache('NavActive');
    if (navActive && navActive === item)
      style = 'active-link';
    return style;
  }

}

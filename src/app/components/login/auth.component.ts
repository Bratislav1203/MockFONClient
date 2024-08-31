import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  activeTab: string = 'login';  // Default tab

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  constructor() {}
  ngOnInit(): void {
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-app-shell',
  template: `
    <img class="loading-indicator" src="loading.gif">
  `,
  styles: [
    `
      
    `
  ]
})
export class AppShellComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import {Component} from '@angular/core';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent {
  public text: string;
  public content: string;

  constructor() {
    this.text = 'Welcome to Morris Ride-Sharing system!';
    this.content = 'To navigate to the ride sharing page, select the menu button in ' +
      'the upper-left hand corner. '
  }
}

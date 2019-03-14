import {Component, OnInit} from '@angular/core';
import {RideListService} from './ride-list.service';
import {Ride} from './ride';

@Component({
  selector: 'ride-component',
  styleUrls: ['./ride.component.css'],
  templateUrl: 'ride.component.html'
})
export class RideComponent implements OnInit {
  public ride: Ride = null;
  private id: string;

  constructor(private rideListService: RideListService) {
    // this.users = this.userListService.getUsers();
  }

  private subscribeToServiceForId() {
    if (this.id) {
      this.rideListService.getRideById(this.id).subscribe(
        ride => this.ride = ride,
        err => {
          console.log(err);
        }
      );
    }
  }

  setId(id: string) {
    this.id = id;
    this.subscribeToServiceForId();
  }

  ngOnInit(): void {
    this.subscribeToServiceForId();
  }
}

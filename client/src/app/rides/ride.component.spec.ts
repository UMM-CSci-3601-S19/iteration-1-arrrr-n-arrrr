import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Ride} from './ride';
import {RideComponent} from './ride.component';
import {RideListService} from './ride-list.service';
import {Observable} from 'rxjs/Observable';
import {CustomModule} from "../custom.module";

describe('Ride component', () => {

  let rideComponent: RideComponent;
  let fixture: ComponentFixture<RideComponent>;

  let rideListServiceStub: {
    getRideById: (rideId: string) => Observable<Ride>
  };

  beforeEach(() => {
    // stub RideService for test purposes
    rideListServiceStub = {
      getRideById: (rideId: string) => Observable.of([
        {
          _id: 'driving_osseo',
          destination: 'Osseo',
          origin: 'Morris',
          notes: 'Ride baby, ride!',
          driving: true
        },
        {
          _id: 'riding_osseo',
          destination: 'Osseo',
          origin: 'Morris',
          notes: 'Help! I need a ride!',
          driving: false
        },
        {
          _id: 'driving_store',
          destination: 'store',
          origin: 'campus',
          notes: 'Anyone need a ride to Willy\'s?',
          driving: true
        },
        {
          _id: 'driving_walmart',
          destination: 'Walmart, Alexandria, MN',
          origin: 'campus',
          notes: 'I can\'t afford to shop anywhere but Walmart',
          driving: false
        }
      ].find(ride => ride._id === rideId))
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [RideComponent],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideComponent);
      rideComponent = fixture.componentInstance;
    });
  }));

  it('can retrieve the ride offer to Osseo by ID', () => {
    rideComponent.setId('driving_osseo');
    expect(rideComponent.ride).toBeDefined();
    expect(rideComponent.ride.destination).toBe('Osseo');
    expect(rideComponent.ride.origin).toBe('Morris');
  });

  it('returns undefined for a ride to Mars', () => {
    rideComponent.setId('driving_to_Mars');
    expect(rideComponent.ride).not.toBeDefined();
  });

});

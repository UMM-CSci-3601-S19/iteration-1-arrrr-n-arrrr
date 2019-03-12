import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Ride} from './ride';
import {RideListComponent} from './ride-list.component';
import {RideListService} from './ride-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MatDialog} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio'

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Ride list', () => {

  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>
  };

  beforeEach(() => {
    // stub RideService for test purposes
    rideListServiceStub = {
      getRides: () => Observable.of([
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
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [RideListComponent],
      // providers:    [ RideListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the rides', () => {
    expect(rideList.rides.length).toBe(4);
  });

  it('contains a ride to \'Osseo\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'Osseo')).toBe(true);
  });

  it('contain a ride to \'store\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'store')).toBe(true);
  });

  it('doesn\'t contain a ride to \'Wonderland\'', () => {
    expect(rideList.rides.some((ride: Ride) => ride.destination === 'Wonderland')).toBe(false);
  });

  it('has two rides to \'Osseo\'', () => {
    expect(rideList.rides.filter((ride: Ride) => ride.destination === 'Osseo').length).toBe(2);
  });

  it('ride list filters by origin', () => {
    expect(rideList.filteredRides.length).toBe(4);
    rideList.rideOrigin = 'Mo';
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(2);
    });
  });

  it('ride list filters by destination', () => {
    expect(rideList.filteredRides.length).toBe(4);
    rideList.rideDestination = 'Wa';
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });

  it('ride list filters by origin and destination', () => {
    expect(rideList.filteredRides.length).toBe(4);
    rideList.rideOrigin = 'c';
    rideList.rideDestination = 's';
    rideList.refreshRides().subscribe(() => {
      expect(rideList.filteredRides.length).toBe(1);
    });
  });

});

describe('Misbehaving Ride List', () => {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>
  };

  beforeEach(() => {
    // stub RideService for test purposes
    rideListServiceStub = {
      getRides: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [RideListComponent],
      providers: [{provide: RideListService, useValue: rideListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a RideListService', () => {
    // Since the observer throws an error, we don't expect rides to be defined.
    expect(rideList.rides).toBeUndefined();
  });
});


describe('Adding a ride', () => {
  let rideList: RideListComponent;
  let fixture: ComponentFixture<RideListComponent>;
  const newRide: Ride = {
    _id: 'riding_willie\'s',
    origin: 'Spooner',
    destination: 'Willie\'s',
    notes: 'Going to buy some Cheetos',
    driving: false
  };
  const newId = 'riding_willie\'s';

  let calledRide: Ride;

  let rideListServiceStub: {
    getRides: () => Observable<Ride[]>,
    addNewRide: (newRide: Ride) => Observable<{ '$oid': string }>
  };
  let mockMatDialog: {
    open: (AddRideComponent, any) => {
      afterClosed: () => Observable<Ride>
    };
  };

  beforeEach(() => {
    calledRide = null;
    // stub RideService for test purposes
    rideListServiceStub = {
      getRides: () => Observable.of([]),
      addNewRide: (newRide: Ride) => {
        calledRide = newRide;
        return Observable.of({
          '$oid': newId
        });
      }
    };
    mockMatDialog = {
      open: () => {
        return {
          afterClosed: () => {
            return Observable.of(newRide);
          }
        };
      }
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [RideListComponent],
      providers: [
        {provide: RideListService, useValue: rideListServiceStub},
        {provide: MatDialog, useValue: mockMatDialog},
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RideListComponent);
      rideList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('calls RideListService.addRide', () => {
    expect(calledRide).toBeNull();
    rideList.openDialog();
    expect(calledRide).toEqual(newRide);
  });
});

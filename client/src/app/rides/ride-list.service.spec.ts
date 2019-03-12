import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Ride} from './ride';
import {RideListService} from './ride-list.service';

describe('Ride list service: ', () => {

  const testRides: Ride[] = [
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
  ];
  const drivingRides: Ride[] = testRides.filter(ride =>
    ride.driving === true
  );

  // We will need some url information from the userListService to meaningfully test company filtering;
  // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
  let rideListService: RideListService;
  let impossibleRideUrl: string;

  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    rideListService = new RideListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getRides() calls api/rides', () => {
    // Assert that the users we get from this call to getUsers()
    // should be our set of test users. Because we're subscribing
    // to the result of getUsers(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testUsers) a few lines
    // down.
    rideListService.getRides().subscribe(
      rides => expect(rides).toBe(testRides)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(rideListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testRides);
  });

  it('getRides(rideDriving) adds appropriate param string to called URL', () => {
    rideListService.getRides("true").subscribe(
      rides => expect(rides).toEqual(drivingRides)
    );

    const req = httpTestingController.expectOne(rideListService.baseUrl + '?driving=true&');
    expect(req.request.method).toEqual('GET');
    req.flush(drivingRides);
  });

  it('filterByDriving(rideDriving) deals appropriately with a URL that already had a parameter', () => {
    impossibleRideUrl = rideListService.baseUrl + '?driving=true&something=killerrobots&';
    rideListService['rideUrl'] = impossibleRideUrl;
    rideListService.filterByDriving("true");
    expect(rideListService['rideUrl']).toEqual(rideListService.baseUrl + '?something=killerrobots&driving=true&');
  });

  it('filterByDriving deals appropriately with a URL that already had some filtering, but no driving status', () => {
    impossibleRideUrl = rideListService.baseUrl + '?something=killerrobots&';
    rideListService['rideUrl'] = impossibleRideUrl;
    rideListService.filterByDriving("true");
    expect(rideListService['rideUrl']).toEqual(rideListService.baseUrl + '?something=killerrobots&driving=true&');
  });

  it('filterByDriving deals appropriately with a URL has the keyword driving, but nothing after the =', () => {
    impossibleRideUrl = rideListService.baseUrl + '?driving=&';
    rideListService['rideUrl'] = impossibleRideUrl;
    rideListService.filterByDriving('');
    expect(rideListService['rideUrl']).toEqual(rideListService.baseUrl + '');
  });

  it('getRideById() calls api/rides/id', () => {
    const targetRide: Ride = testRides[1];
    const targetId: string = targetRide._id;
    rideListService.getRideById(targetId).subscribe(
      ride => expect(ride).toBe(targetRide)
    );

    const expectedUrl: string = rideListService.baseUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetRide);
  });

  it('adding a ride calls api/users/new', () => {
    const driving_north_id = 'driving_north_id';
    const newRide: Ride = {
      _id: '',
      destination: 'North Pole',
      origin: 'South Pole',
      notes: 'I will pay for gas!!!?',
      driving: false
    };

    rideListService.addNewRide(newRide).subscribe(
      id => {
        expect(id).toBe(driving_north_id);
      }
    );

    const expectedUrl: string = rideListService.baseUrl + '/new';
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(driving_north_id);
  });
});

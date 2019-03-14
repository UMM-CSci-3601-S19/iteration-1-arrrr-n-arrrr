import {RidePage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// This line (combined with the function that follows) is here for us
// to be able to see what happens (part of slowing things down)
// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  // This delay is only put here so that you can watch the browser do its thing.
  // If you're tired of it taking long you can remove this call or change the delay
  // to something smaller (even 0).
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Ride list', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
  });

  it('should get and highlight Rides title attribute ', () => {
    page.navigateTo();
    expect(page.getRideTitle()).toEqual('Rides');
  });


  it('should type something in filter destination box and check that it returned correct elements', () => {
    page.navigateTo();

    // Here is a result on the page


    expect(page.getUniqueRide('5c81d965e9106fdc1a0cd630')).toEqual('transfer_within_a_station Needs a ride to: Ada , Minnesota');

    page.typeADestination('ore');
    // This should gives a 3 rides (2 offers and 1 request). The top result is no longer there.
    expect(page.getUniqueRide('5c81d96523def802a96be651')).toEqual('drive_eta Driving to: Fillmore , Minnesota');
    expect(page.getUniqueRide('5c81d96596f249966d2f1ee8')).toEqual('transfer_within_a_station Needs a ride to: Forestburg , Minnesota');







    page.typeADestination('ore');
    // That should now make the search bar contain 'oreore'. There should no longer be any rides displaying.
    // We test this by ensuring no element of class 'rides' exists
    //expect(page.elementExistsWithClass('mat-card-title ng-star-inserted')).toBeFalsy();
    page.getRides().then((rides) => {
      expect(rides.length).toBe(0);
    });
    // Now we clear the search field and see that our first result is back.
    page.backspace(6);
    expect(page.getUniqueRide('5c81d965e9106fdc1a0cd630')).toEqual('transfer_within_a_station Needs a ride to: Ada , Minnesota');
  });


  it('should type something in filter origin box and check that it returned correct elements', () => {
    page.navigateTo();

    // This ride origins from these results are 'Osseo', 'Osceola, WI', and 'campus' (respectively)
    expect(page.getUniqueRide('5c81d9652058a4c037320433')).toEqual('drive_eta Driving to: Teasdale , Minnesota');
    expect(page.getUniqueRide('5c81d965680b7806d09766b8')).toEqual('transfer_within_a_station Needs a ride to: 17252 Weaver Lake Drive Maple Grove, MN 55311');
    expect(page.getUniqueRide('5c81d965db64b6a0d95905ee')).toEqual('transfer_within_a_station Needs a ride to: Willy\'s Supervalu');




    page.typeAnOrigin('os');
    // The posting with origin of Osseo should no longer be on the list
    //expect(page.elementExistsWithId('5c81d9652058a4c037320433')).not.toBe(true); // Osseo
    page.getRides().then((rides) => {
      expect(rides.length).toBe(2);
    });
    expect(page.elementExistsWithId('5c81d9652058a4c037320433')).toBe(true); // Osseo
    expect(page.elementExistsWithId('5c81d965680b7806d09766b8')).toBe(true); // Osceola, WI





    page.typeAnOrigin('s'); //origin input is now 'mo'
    // The posting with origin of 'campus' should no longer exist
    expect(page.elementExistsWithId('5c81d9652058a4c037320433')).toBe(true); // Osseo
    //expect(page.elementExistsWithId('5c81d965db64b6a0d95905ee')).toBe(false); // campus
    page.getRides().then((rides) => {
      expect(rides.length).toBe(1);
    });

    page.typeAnOrigin('oasd'); //origin input is now 'mooasd'. There are no longer any rides displayed
    // We test this by ensuring no element of class 'rides' exists
    page.getRides().then((rides) => {
      expect(rides.length).toBe(0);
    });

    // Now we clear the search field and see that our results are back.
    page.backspace(7);
    expect(page.elementExistsWithId('5c81d9652058a4c037320433')).toBe(true); // Osseo
    expect(page.elementExistsWithId('5c81d965680b7806d09766b8')).toBe(true); // Osceola, WI
    expect(page.elementExistsWithId('5c81d965db64b6a0d95905ee')).toBe(true); // campus
  });

  it('Should allow us to filter rides based on driving status', () => {
    page.navigateTo();
    page.getDriving(true); // true means, click on the radio button to display posts OFFERING rides
    page.getRides().then((rides) => {
      expect(rides.length).toBe(22);
    });
  });

  it('Should allow us to search for drivers, then click the button to search for riders', () => {
    page.navigateTo();
    page.getDriving(true);
    page.getRides().then((rides) => {
      expect(rides.length).toBe(22);
    });
    page.getDriving(false);
    page.getRides().then((rides) => {
      expect(rides.length).toBe(28);
    });
  });


// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

  it('Should have an add ride button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('addNewRide')).toBeTruthy();
  });

  it('Should open a dialog box when add ride button is clicked', () => {
    page.navigateTo();
    expect(page.elementExistsWithCss('add-ride')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewRide');
    expect(page.elementExistsWithCss('add-ride')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Ride', () => {

    beforeEach(() => {
      page.navigateTo();
      page.click('addNewRide');
    });

    it('Should actually add the ride with the information we put in the fields', () => {
      const isDriving = element(by.id('isDrivingFORM'));
      page.field('destinationField').sendKeys('North Pole');
      page.field('originField').sendKeys('South Pole');
      page.field('notesField').sendKeys('I will pay for gas!!!?');
      isDriving.click();
      expect(page.button('confirmAddRideButton').isEnabled()).toBe(true);

      page.click('confirmAddRideButton');
      page.typeADestination('North Pole');
      page.typeAnOrigin('South Pole');
      page.getRides().then((rides) => {
        expect(rides.length ===1);
      });

      expect(page.elementExistsWithClass('rides')).toBe(true);


    });
  });


    describe('Add Ride (Validation)', () => {

      beforeEach( () => {
        page.click('addNewRide')
      });

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add ride dialog', () => {

        expect(page.field('destinationField').isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').sendKeys('North Pole');

        expect(element(by.id('originField')).isPresent()).toBeTruthy('There should be an origin field');
        page.field('originField').sendKeys('South Pole');

        expect(page.field('notesField').isPresent()).toBeTruthy('There should be a notes field');
        page.field('notesField').sendKeys('I will pay for gas!!!?');

        expect(page.elementExistsWithId('isDrivingFORM')).toBeTruthy('There should be a is driving radio button');
        element(by.id('isDrivingFORM')).click();

        expect(page.elementExistsWithId('isNotDrivingFORM')).toBeTruthy('There should be a is driving radio button');
        element(by.id('isNotDrivingFORM')).click();
      });


      ////////////////////////////////////////////////////////
      ////////////////  Destination validation ///////////////
      ////////////////////////////////////////////////////////

      it('Should show the validation error message about destination being too small if smaller than 3 characters', () => {
        expect(page.elementExistsWithId('destinationField')).toBeTruthy('There should be a destination field');
        page.field('destinationField').clear();
        page.field('destinationField').sendKeys('t');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('originField').click();
        expect(page.getTextFromField('destination-error')).toBe('Destination must be at least 3 characters long');
      });

      it('Should show the validation error message about destination being required', () => {
        expect(element(by.id('destinationField')).isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').clear();
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('originField').click();
        expect(page.getTextFromField('destination-error')).toBe('Destination is required');
      });

      it('Should show the validation error message about destination being too larger if longer than 50 characters', () => {
        expect(element(by.id('destinationField')).isPresent()).toBeTruthy('There should be a destination field');
        page.field('destinationField').clear();
        page.field('destinationField').sendKeys('12345678901234567890123456789012345678901234567980145');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('originField').click();
        expect(page.getTextFromField('destination-error')).toBe('Destination cannot be more than 50 characters long');
      });


      ////////////////////////////////////////////////////////
      ////////////////  Origin validation      ///////////////
      ////////////////////////////////////////////////////////


      it('Should show the validation error message about origin being too small if smaller than 3 characters', () => {
        expect(element(by.id('originField')).isPresent()).toBeTruthy('There should be a origin field');
        page.field('originField').clear();
        page.field('originField').sendKeys('t');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('destinationField').click();
        expect(page.getTextFromField('origin-error')).toBe('Origin must be at least 3 characters long');
      });

      it('Should show the validation error message about origin being required', () => {
        expect(element(by.id('originField')).isPresent()).toBeTruthy('There should be a origin field');
        page.field('originField').clear();
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('originField').click();
        page.field('destinationField').click();
        expect(page.getTextFromField('origin-error')).toBe('Origin is required');
      });

      it('Should show the validation error message about origin being too larger if longer than 50 characters', () => {
        expect(element(by.id('originField')).isPresent()).toBeTruthy('There should be a origin field');
        page.field('originField').clear();
        page.field('originField').sendKeys('12345678901234567890123456789012345678901234567980145');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('destinationField').click();
        expect(page.getTextFromField('origin-error')).toBe('Origin cannot be more than 50 characters long');
      });


      ////////////////////////////////////////////////////////
      ////////////////  Notes validation       ///////////////
      ////////////////////////////////////////////////////////


      it('Should show the validation error message about notes being too small if smaller than 3 characters', () => {
        expect(element(by.id('notesField')).isPresent()).toBeTruthy('There should be a notes field');
        page.field('notesField').clear();
        page.field('notesField').sendKeys('t');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        page.field('originField').click();
        expect(page.getTextFromField('notes-error')).toBe('Notes must be at least 3 characters long');
      });

      it('Should show the validation error message about notes being required', () => {
        expect(element(by.id('notesField')).isPresent()).toBeTruthy('There should be a notes field');
        page.field('notesField').clear();
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('notesField').click();
        page.field('originField').click();
        expect(page.getTextFromField('notes-error')).toBe('Notes are required');
      });

      it('Should show the validation error message about notes being too larger if longer than 300 characters', () => {
        expect(element(by.id('notesField')).isPresent()).toBeTruthy('There should be a notes field');
        page.field('notesField').clear();
        page.typeManyNotes();
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('destinationField').click();
        expect(page.getTextFromField('notes-error')).toBe('Notes cannot be more than 300 characters long');
      });


      ////////////////////////////////////////////////////////
      /////////////  Driving/riding validation ////////////////
      ////////////////////////////////////////////////////////

      it('Should show the validation error message about notes being required', () => {
        expect(element(by.id('notesField')).isPresent()).toBeTruthy('There should be a notes field');
        // '\b' is a backspace, so this enters an 'A' and removes it so this
        // field is "dirty", i.e., it's seen as having changed so the validation
        // tests are run.
        page.field('notesField').sendKeys('A\b');
        expect(page.button('confirmAddRideButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('destinationField').click();
        expect(page.getTextFromField('notes-error')).toBe('Notes are required');
      });


    });
  });


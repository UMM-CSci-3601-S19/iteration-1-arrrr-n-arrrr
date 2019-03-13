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
    expect(page.getUniqueRide('5c81d965e9106fdc1a0cd630')).toEqual('Needs a ride to: Ada , Minnesota');

    page.typeADestination('ore');
    // This should gives a 3 rides (2 offers and 1 request). The top result is no longer there.
    expect(page.getUniqueRide('5c81d96523def802a96be651')).toEqual('Driving to: Fillmore , Minnesota');
    expect(page.getUniqueRide('5c81d96596f249966d2f1ee8')).toEqual('Needs a ride to: Forestburg , Minnesota');

    page.typeADestination('ore');
    // That should now make the search bar contain 'oreore'. There should no longer be any rides displaying.
    // We test this by ensuring no element of class 'rides' exists
    expect(page.elementExistsWithClass('rides')).toBe(false);

    // Now we clear the search field and see that our first result is back.
    page.backspace(6);
    expect(page.getUniqueRide('5c81d965e9106fdc1a0cd630')).toEqual('Needs a ride to: Ada , Minnesota');
  });


  it('should type something in filter origin box and check that it returned correct elements', () => {
    page.navigateTo();

    // This ride origins from these results are 'Osseo', 'Morris', and 'campus' (respectively)
    expect(page.getUniqueRide('5c81d9652058a4c037320433')).toEqual('Driving to: Teasdale , Minnesota');
    expect(page.getUniqueRide('5c81d965c015b6bade4d1d80')).toEqual('Needs a ride to: Ahwahnee , Minnesota');
    expect(page.getUniqueRide('5c81d965db64b6a0d95905ee')).toEqual('Needs a ride to: Willy\'s Supervalu');

    page.typeAnOrigin('m');
    // The posting with origin of Osseo should no longer be on the list
    expect(page.elementExistsWithId('5c81d9652058a4c037320433')).toBe(false); // Osseo
    expect(page.elementExistsWithId('5c81d965c015b6bade4d1d80')).toBe(true); // Morris
    expect(page.elementExistsWithId('5c81d965db64b6a0d95905ee')).toBe(true); // campus

    page.typeAnOrigin('o'); //origin input is now 'mo'
    // The posting with origin of 'campus' should no longer exist
    expect(page.elementExistsWithId('5c81d965c015b6bade4d1d80')).toBe(true); // Morris
    expect(page.elementExistsWithId('5c81d965db64b6a0d95905ee')).toBe(false); // campus

    page.typeAnOrigin('oasd'); //origin input is now 'mooasd'. There are no longer any rides displayed
    // We test this by ensuring no element of class 'rides' exists
    expect(page.elementExistsWithClass('rides')).toBe(false);

    // Now we clear the search field and see that our results are back.
    page.backspace(6);
    expect(page.elementExistsWithId('5c81d9652058a4c037320433')).toBe(true); // Osseo
    expect(page.elementExistsWithId('5c81d965c015b6bade4d1d80')).toBe(true); // Morris
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
      const isDriving = element(by.id('isDrivingFORM'))
      page.field('destination').sendKeys('North Pole');
      page.field('origin').sendKeys('South Pole');
      page.field('notes').sendKeys('I will pay for gas!!!?');
      isDriving.click();
      expect(page.button('confirmAddRideButton').isEnabled()).toBe(true);
      page.click('confirmAddRideButton');

      browser.wait(protractor.ExpectedConditions.presenceOf(tracy_element), 10000);

      // left off //

    });

    describe('Add User (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add user dialog', () => {
        expect(page.field('nameField').isPresent()).toBeTruthy('There should be a name field');
        page.field('nameField').sendKeys('Dana Jones');
        expect(element(by.id('ageField')).isPresent()).toBeTruthy('There should be an age field');
        // Need to clear this field because the default value is -1.
        page.field('ageField').clear();
        page.field('ageField').sendKeys('24');
        expect(page.field('companyField').isPresent()).toBeTruthy('There should be a company field');
        page.field('companyField').sendKeys('Awesome Startup, LLC');
        expect(page.field('emailField').isPresent()).toBeTruthy('There should be an email field');
        page.field('emailField').sendKeys('dana@awesome.com');
      });

      it('Should show the validation error message about age being too small if the age is less than 15', () => {
        expect(element(by.id('ageField')).isPresent()).toBeTruthy('There should be an age field');
        page.field('ageField').clear();
        page.field('ageField').sendKeys('2');
        expect(page.button('confirmAddUserButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('nameField').click();
        expect(page.getTextFromField('age-error')).toBe('Age must be at least 15');
      });

      it('Should show the validation error message about age being required', () => {
        expect(element(by.id('ageField')).isPresent()).toBeTruthy('There should be an age field');
        page.field('ageField').clear();
        expect(page.button('confirmAddUserButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('nameField').click();
        expect(page.getTextFromField('age-error')).toBe('Age is required');
      });

      it('Should show the validation error message about name being required', () => {
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be a name field');
        // '\b' is a backspace, so this enters an 'A' and removes it so this
        // field is "dirty", i.e., it's seen as having changed so the validation
        // tests are run.
        page.field('nameField').sendKeys('A\b');
        expect(page.button('confirmAddUserButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('ageField').click();
        expect(page.getTextFromField('name-error')).toBe('Name is required');
      });

      it('Should show the validation error message about the format of name', () => {
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be an name field');
        page.field('nameField').sendKeys('Don@ld Jones');
        expect(page.button('confirmAddUserButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('ageField').click();
        expect(page.getTextFromField('name-error')).toBe('Name must contain only numbers and letters');
      });

      it('Should show the validation error message about the name being taken', () => {
        expect(element(by.id('nameField')).isPresent()).toBeTruthy('There should be an name field');
        page.field('nameField').sendKeys('abc123');
        expect(page.button('confirmAddUserButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('ageField').click();
        expect(page.getTextFromField('name-error')).toBe('Name has already been taken');
      });

      it('Should show the validation error message about email format', () => {
        expect(element(by.id('emailField')).isPresent()).toBeTruthy('There should be an email field');
        page.field('nameField').sendKeys('Donald Jones');
        page.field('ageField').sendKeys('30');
        page.field('emailField').sendKeys('donjones.com');
        expect(page.button('confirmAddUserButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('nameField').click();
        expect(page.getTextFromField('email-error')).toBe('Email must be formatted properly');
      });
    });
  });
});


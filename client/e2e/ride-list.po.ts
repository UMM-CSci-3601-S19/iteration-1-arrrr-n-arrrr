import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class RidePage {
  navigateTo(): promise.Promise<any> {
    return browser.get('/rides');
  }

  // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
  highlightElement(byObject) {
    function setStyle(element, style) {
      const previous = element.getAttribute('style');
      element.setAttribute('style', style);
      setTimeout(() => {
        element.setAttribute('style', previous);
      }, 200);
      return 'highlighted';
    }

    return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
  }

  getRideTitle() {
    const title = element(by.id('ride-list-title')).getText();
    this.highlightElement(by.id('ride-list-title'));

    return title;
  }

  typeADestination(destination: string) {
    const input = element(by.id('rideDestination'));
    input.click();
    input.sendKeys(destination);
  }

  typeAnOrigin(origin: string) {
    const input = element(by.id('rideOrigin'));
    input.click();
    input.sendKeys(origin);
  }

  selectUpKey() {
    browser.actions().sendKeys(Key.ARROW_UP).perform();
  }

  backspace(n: number) {

    let i : number;
    for ( i = 0; i < n; i++) {
      browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }
  }

  getDriving(isDriving: boolean) {
    if (isDriving) {
      const input = element(by.id('isDriving'));
      input.click();
      this.click('submit');
    } else {
      const input = element(by.id('isNotDriving'));
      input.click();
      this.click('submit')
    }
  }

  getRidesByDestination() {
    const input = element(by.id('rideDestination'));
    input.click();
    input.sendKeys(Key.TAB);
  }

  getRidesByOrigin() {
    const input = element(by.id('rideOrigin'));
    input.click();
    input.sendKeys(Key.TAB);
  }

  getUniqueRide(id: string) {
    const ride = element(by.id(id)).getText();
    this.highlightElement(by.id(id));
    return ride;
  }

  getRides() {
    return element.all(by.className('rides'));
  }

  elementExistsWithId(idOfElement: string): promise.Promise<boolean> {
    if (element(by.id(idOfElement)).isPresent()) {
      this.highlightElement(by.id(idOfElement));
    }
    return element(by.id(idOfElement)).isPresent();
  }


  elementExistsWithClass(classOfElement: string): promise.Promise<boolean> {
    if (element(by.className(classOfElement)).isPresent()) {
      this.highlightElement(by.className(classOfElement));
    }
    return element(by.className(classOfElement)).isPresent();
  }

  elementExistsWithCss(cssOfElement: string): promise.Promise<boolean> {
    return element(by.css(cssOfElement)).isPresent();
  }

  click(idOfButton: string): promise.Promise<void> {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton)).click();
  }

  field(idOfField: string) {
    return element(by.id(idOfField));
  }

  button(idOfButton: string) {
    this.highlightElement(by.id(idOfButton));
    return element(by.id(idOfButton));
  }

  getTextFromField(idOfField: string) {
    this.highlightElement(by.id(idOfField));
    return element(by.id(idOfField)).getText();
  }

  /*delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
*/
  /*sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async demo() {
    console.log('Taking a break...');
    await sleep(2000);
    console.log('Two seconds later');
  }*/

}

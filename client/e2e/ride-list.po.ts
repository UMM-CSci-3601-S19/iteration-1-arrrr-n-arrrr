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

  typeManyNotes() {
    const input = element(by.id('notesField'));
    input.click();
    input.sendKeys("The history of all hitherto existing society(2) is the history of class struggles.\n" +
      "\n" +
      "Freeman and slave, patrician and plebeian, lord and serf, guild-master(3) and journeyman, in a word, oppressor and oppressed, stood in constant opposition to one another, carried on an uninterrupted, now hidden, now open fight, a fight that each time ended, either in a revolutionary reconstitution of society at large, or in the common ruin of the contending classes.\n" +
      "\n" +
      "In the earlier epochs of history, we find almost everywhere a complicated arrangement of society into various orders, a manifold gradation of social rank. In ancient Rome we have patricians, knights, plebeians, slaves; in the Middle Ages, feudal lords, vassals, guild-masters, journeymen, apprentices, serfs; in almost all of these classes, again, subordinate gradations.\n" +
      "\n" +
      "The modern bourgeois society that has sprouted from the ruins of feudal society has not done away with class antagonisms. It has but established new classes, new conditions of oppression, new forms of struggle in place of the old ones.\n" +
      "\n" +
      "Our epoch, the epoch of the bourgeoisie, possesses, however, this distinct feature: it has simplified class antagonisms. Society as a whole is more and more splitting up into two great hostile camps, into two great classes directly facing each other — Bourgeoisie and Proletariat.\n" +
      "\n" +
      "From the serfs of the Middle Ages sprang the chartered burghers of the earliest towns. From these burgesses the first elements of the bourgeoisie were developed.\n" +
      "\n" +
      "The discovery of America, the rounding of the Cape, opened up fresh ground for the rising bourgeoisie. The East-Indian and Chinese markets, the colonisation of America, trade with the colonies, the increase in the means of exchange and in commodities generally, gave to commerce, to navigation, to industry, an impulse never before known, and thereby, to the revolutionary element in the tottering feudal society, a rapid development.");
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

  typeCharacters(n :number) {
    let i: number;
    for (i = 0; i < n; i++) {
      browser.actions().sendKeys('r').perform();
    }
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

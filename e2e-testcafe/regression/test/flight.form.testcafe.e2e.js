import { getRole } from "../../config/get-role";
import { Selector, ClientFunction } from "testcafe";
import FlightPageModel from "../../page-objects/flight-page-mode";
import { DateComparement } from "../../page-objects/shared/common-selectors";
import { CommonHeader } from "../../page-objects/shared/common-header-navigation";
import { CommonButton } from "../../page-objects/shared/common-button";
import Shared from "../../page-objects/shared/shared";

const flightPageObject = FlightPageModel.get();
const dateComparement = DateComparement.get();
const commonHeader = CommonHeader.get();
const commonButton = CommonButton.get();
let allInputs = new Map();

fixture('php travels test login')
    .beforeEach(async t => {
        await t
            .navigateTo("https://phptravels.net/flights")
            .maximizeWindow()
            .wait(2000)
            //.click(await commonHeader.selectEnglishHeaderc())
            .useRole(getRole())    
            .wait(2000)
            .click(Selector('a').withText('Flights'))
        allInputs = await flightPageObject.getAllRegularDates()
            //.navigateTo(orderDatepageObject.homepage)

    });

test.meta({testType: 'regression', severity: 'high', author:'ivan'})
    ('Provjeri da li se aplikacija za letove uspjesno ucitava i ispravnost linka', async t => {
       await t.expect(await (await flightPageObject.isExists()).exists).ok('Search for flights page postoji');

        await t
           .expect((flightPageObject.getFlightsTitle()).innerText).contains('SEARCH FOR BEST FLIGHT')

       // t
         //   .wait(10000)
           // .expect(orderDatepageObject.location)
            //.contains(orderDatepageObject.homePage);
})

test.meta({testType: 'regression', severity: 'low', author:'ivan'})
    ('Odaberi grad iz dropdown menua na 3 rijeci i provjeri da li postoji', async t => { 
        const flyingFrom = flightPageObject.getElementByLabelName('Flying From', allInputs);
        const toDestination = flightPageObject.getElementByLabelName('To Destination', allInputs)
        const departureDate = flightPageObject.getElementByLabelName('Departure Date', allInputs)
        const passengers = flightPageObject.getElementByLabelName('Passengers', allInputs)
        /*
        console.log(`Flying from je ${flyingFrom},
            to destination je ${toDestination},
            departure date je ${departureDate},
            passengers je ${passengers}`);
        */
        await t
            .wait(3000)
            .click(flyingFrom)
            .typeText((await flightPageObject.getCityInput('Flying From')), 'Zagreb')
            .expect((await flightPageObject.getAllSearchResults()).count)
            .gte(1)
        
        await t
            .click(await flightPageObject.selectInputByIndex(0))
            .wait(5000)
            //.expect(await flightPageObject.getAllSearchResults().exists)
            //.ok()
            .click(toDestination)
            .typeText((await flightPageObject.getCityInput('To Destination')), 'New York')
            .expect((await flightPageObject.getAllSearchResults()).count)
            .gte(1)
            .wait(500)
            .click(await flightPageObject.selectInputByIndex(1))

        await t
            .click(departureDate)
        
        await t
            .click(Object.values(await flightPageObject.getAvailableCheckInOutDates(2))[0])
            .wait(500)
            .expect(await passengers.exists).ok('Passengers postoji')
            .click(passengers)
            .wait(1000)
            .click(Selector('.dropdown-menu')
                .withAttribute('style', /display: block;/)
                .child('.dropdown-item')
                .nth(0)
                .find('.qtyInc'))
                .wait(500)
                .expect(passengers.find('.guest_flights').innerText)
                .eql("2")
                //.wait(500)
                //.expect(Selector('#flights_load').hasClass('show'))
                //.notOk()
            
        console.log("expect flying modal to be showed");
        await commonButton.clickOnButton()
        await t
            .wait(2000).expect(Selector('#flights_load').hasClass('show'))
            .ok()



})

test.meta({testType: 'regression', severity: 'medium', author:'ivan'})
    ('Provjeri da li je return date prikazan nakon klika i da li su letovi uzlazno poredani po cijeni'
    , async t => {
        const flyingFrom = flightPageObject.getElementByLabelName('Flying From', allInputs);
        const toDestination = flightPageObject.getElementByLabelName('To Destination', allInputs)
        const departureDate = flightPageObject.getElementByLabelName('Departure Date', allInputs)
        const passengers = flightPageObject.getElementByLabelName('Passengers', allInputs)
        
        await t
            .wait(1000)
            .click(await flightPageObject.getRoundTripRadioButton())
            .click(flyingFrom)
            .typeText((await flightPageObject.getCityInput('Flying From')), 'Zagreb')
            .wait(500)
            .click(await flightPageObject.selectInputByIndex(0))
        
        await t
            .click(toDestination)
            .typeText((await flightPageObject.getCityInput('To Destination')), 'New York')
            .click(await flightPageObject.selectInputByIndex(1))
        
        await t 
            .click(departureDate)

        
        await t
            .click(Object.values(await flightPageObject.getAvailableCheckInOutDates(2))[0])
            .wait(500)
            .click(Object.values(await flightPageObject.getAvailableCheckInOutDates(3))[0])
            .click(passengers).wait(1000)
            .click(Selector('.dropdown-menu')
                .withAttribute('style', /display: block;/)
                .child('.dropdown-item')
                .nth(0)
                .find('.qtyInc'))
               
        await commonButton.clickOnButton()
        await t.wait(10000);
        await Shared.checkIfResultsAreSortedAscending(Selector('.theme-search-results-item-price-btn').child('strong'))

        
 })

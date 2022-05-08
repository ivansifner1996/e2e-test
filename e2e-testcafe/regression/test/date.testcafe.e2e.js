import { getRole } from "../../config/get-role";
import { Selector, ClientFunction } from "testcafe";
import OrderDatePageModel from "../../page-objects/order-date-page-model";
import { DateComparement } from "../../page-objects/shared/common-selectors";
import { CommonHeader } from "../../page-objects/shared/common-header-navigation";
import { CommonButton } from "../../page-objects/shared/common-button";

const orderDatepageObject = OrderDatePageModel.get();
const dateComparement = DateComparement.get();
const commonHeader = CommonHeader.get();
const commonButton = CommonButton.get();
let allInputs = new Map();

fixture('php travels test login')
    .beforeEach(async t => {
        await t
            .navigateTo("https://phptravels.net/hotels")
            .maximizeWindow()
            .wait(2000)
            .click(await commonHeader.selectEnglishHeader())
        await t
            .useRole(getRole())    
            .wait(3000)
            .click(Selector('a').withText('Hotels'))
        allInputs = await orderDatepageObject.getAllRegularDates()
            //.navigateTo(orderDatepageObject.homepage)

    });

test.meta({testType: 'regression', severity: 'high', author:'ivan'})
    ('Provjeri da li se aplikacija uspjesno ucitava i ispravnost linka', async t => {
       await t.expect(await (await orderDatepageObject.isExists()).exists).ok('Hotel details page postoji');

        await t
           .expect((orderDatepageObject.getHotelTitle()).innerText).contains('HOTELS')

       // t
         //   .wait(10000)
           // .expect(orderDatepageObject.location)
            //.contains(orderDatepageObject.homePage);
})

test.meta({testType: 'regression', severity: 'low', author:'ivan'})
    ('Odaberi grad iz dropdown menua na 3 rijeci i provjeri da li postoji', async t => {
        await t
            .click(orderDatepageObject.getElementByLabelName('City Name', allInputs))
            .typeText((await orderDatepageObject.getCityInput(allInputs)), 'Zag')
            .expect((await orderDatepageObject.getAllSearchResults()).count)
            .eql(4)
            .wait(4000)

        await t
            .click(await orderDatepageObject.selectInputByIndex(2))
            .wait(5000)
            .expect(orderDatepageObject.
                getSelectedCityElement(orderDatepageObject.getElementByLabelName('City Name', allInputs))
                .innerText)
            .contains('Zagreb,Croatia')
            
})

test.meta({testType: 'regression', severity: 'medium', author:'ivan'})
    ('Provjeri da li je datum dolaska veci od datuma odlaska i odradi search', async t => {
        const checkinDate = orderDatepageObject.getElementByLabelName('Checkin', allInputs);
        const checkoutDate = orderDatepageObject.getElementByLabelName('Checkout', allInputs);
        const travellers = orderDatepageObject.getElementByLabelName('Travellers', allInputs);
        
        await t
            .click(orderDatepageObject.getElementByLabelName('City Name', allInputs))
            .typeText((await orderDatepageObject.getCityInput(allInputs)), 'Zag')
            .expect((await orderDatepageObject.getAllSearchResults()).count)
            .eql(4)
            .wait(4000)

        await t
            .click(await orderDatepageObject.selectInputByIndex(2))
            .wait(5000)
            .expect(orderDatepageObject.
                getSelectedCityElement(orderDatepageObject.getElementByLabelName('City Name', allInputs))
                .innerText)
            .contains('Zagreb,Croatia')
        
       await t
            .click(checkinDate)
        await t
            .click(Object.values(await orderDatepageObject.getAvailableCheckInOutDates(2))[0])
            .wait(5000)
            .click(checkoutDate)
            .expect(await dateComparement.getDateValue(checkoutDate))
            .gt(await dateComparement.getDateValue(checkinDate), 'The value of date is greater')
        
        await t
            .click(checkinDate)
            .wait(2000)
        await t
            .click(Object.values(await orderDatepageObject.getAvailableCheckInOutDates(2))[0])
            //.wait(2000)
            .expect(Object.values(await orderDatepageObject.getAvailableCheckInOutDates(2))[1])
            .lt(Object.values(await orderDatepageObject.getAvailableCheckInOutDates(3))[1])
            .click(Object.values(await orderDatepageObject.getAvailableCheckInOutDates(3))[0])


    //await t.expect(await (await orderDatepageObject.isExists()).exists).ok('Hotel details page postoji');
        await t
            .wait(2000)
            .click(travellers)
            .expect(await travellers.exists).ok('Postoji travellers button')
            .wait(1000)
            .click(Selector('.dropdown-menu')
                .withAttribute('style', /display: block;/)
                .child('.dropdown-item')
                .nth(1)
                .find('.qtyDec'))
            
        await commonButton.clickOnButton();
        await t
            .wait(2000)
            .expect(Selector('img')
                .withAttribute('alt', "no results")
                .exists).ok('Postoji no results found')
        
 })

import { getRole } from "../../config/get-role";
import { Selector, ClientFunction } from "testcafe";
import ToursPageObject from "../../page-objects/tours-page-model";
import { DateComparement } from "../../page-objects/shared/common-selectors";
import { CommonHeader } from "../../page-objects/shared/common-header-navigation";
import { CommonButton } from "../../page-objects/shared/common-button";

const toursPageObject = ToursPageObject.get();
const dateComparement = DateComparement.get();
const commonHeader = CommonHeader.get();
const commonButton = CommonButton.get();
let allInputs = new Map();

fixture('php travels test login')
    .beforeEach(async t => {
        await t
            .navigateTo("https://phptravels.net/tours")
            .maximizeWindow()
            .wait(2000)
            .click(await commonHeader.selectEnglishHeader())
        await t
            .useRole(getRole())    
            .wait(3000)
            .click(Selector('a').withText('Tours'))
        allInputs = await toursPageObject.getAllData()
            //.navigateTo(orderDatepageObject.homepage)

    });

test.meta({testType: 'regression', severity: 'high', author:'ivan'})
    ('Provjeri da li se tours uspjesno ucitava i ispravnost linka', async t => {
       await t.expect(await (await toursPageObject.isExists()).exists).ok('Tours page postoji');

        await t
           .expect((toursPageObject.getToursTitle()).innerText).contains('FIND BEST TOURS PACKAGES TODAY')

       // t
         //   .wait(10000)
           // .expect(orderDatepageObject.location)
            //.contains(orderDatepageObject.homePage);
})

test.meta({testType: 'regression', severity: 'medium', author: 'ivan'})
    ("Aplikacija treba naci tours prema proizvoljnoj pretrazi", async t => {
        const destination = toursPageObject.getElementByLabelName('Destination', allInputs);
        const orderDate = toursPageObject.getElementByLabelName('Date', allInputs)
        const travellers = toursPageObject.getElementByLabelName('Travellers', allInputs)
 
        await t
            .wait(1000)
            .click(destination)
            .typeText((await toursPageObject.getCityInput()), 'Zag')
            .wait(500)
            .click(await toursPageObject.selectInputByIndex(2))

        await t
            .click(orderDate)
        const selectedDate = Object.values(await toursPageObject.getAvailableCheckInOutDates(3))[1]
        console.log(`selected date je ${selectedDate}`);
        await t
            .wait(2000)
            .click(Object.values(await toursPageObject.getAvailableCheckInOutDates(3))[0]).wait(1000)

        await t
            .expect(await travellers.exists).ok("Ne postoji travellers tab")
            .click(travellers)
            .click(await toursPageObject.editTravellers('adult', 'qtyInc'))
            .wait(5000)

        await commonButton.clickOnButton()
        //await t
          //  .expect(Selector('#tours_load').hasClass('show'))
          //  .ok()
        toursPageObject.updatedLink = toursPageObject.redirectLinkTours(selectedDate)+`/${toursPageObject.travellers["adults"]}/${toursPageObject.travellers["childs"]}`
        
        /*
        await t
            .wait(5000)
            .expect(toursPageObject.redirectLinkTours(selectedDate)+`/${toursPageObject.travellers["adults"]}/${toursPageObject.travellers["childs"]}`)
            .eql(await (ClientFunction(() => window.location.href))())
            */
        //await toursPageObject.checkIfSearchesContainTerms();

    })

test.meta({testType: 'regression', severity: 'medium', author: 'ivan'})
    ("Provjera da li se odradila navigacija na ispravan link te ispravnost prikaza rezultata", 
        async t => {
            await t
                .navigateTo(toursPageObject.updatedLink)
                .wait(3000)
                .expect((ClientFunction(() => window.location.href)()))
                .eql(toursPageObject.updatedLink)

    })


import { getRole } from "../../config/get-role";
import { Selector, ClientFunction } from "testcafe";
import VisaPageObject from "../../page-objects/visa-page-model";
import { DateComparement } from "../../page-objects/shared/common-selectors";
import SubmitFormPageObject from "../../page-objects/submission-form-page-model";
import { CommonHeader } from "../../page-objects/shared/common-header-navigation";
import { CommonButton } from "../../page-objects/shared/common-button";
import Shared from "../../page-objects/shared/shared";

const visaPageObject = VisaPageObject.get();
const submitFormPageObject = SubmitFormPageObject.get();
const commonHeader = CommonHeader.get();
let allInputs = new Map();

fixture('php visa test login')
    .beforeEach(async t => {
        await t
            .navigateTo("https://phptravels.net/visa")
            .maximizeWindow()
            .wait(2000)
            .click(await commonHeader.selectEnglishHeader())
            .useRole(getRole())    
            .wait(2000)
            .click(Selector('a').withText('Visa'))
        allInputs = await visaPageObject.getAllData()
            //.navigateTo(orderDatepageObject.homepage)

    });

test.meta({testType: 'regression', severity: 'high', author:'ivan'})
    ('Provjeri da li se aplikacija za vize uspjesno ucitava i ispravnost linka', async t => {
       await t.expect(await (await visaPageObject.isExists()).exists).ok('Visa page postoji');

        await t
           .expect((visaPageObject.getToursTitle()).innerText).contains('Submit Your Visa Today!')
})

test.meta({testType: 'regression', severity: 'low', author:'ivan'})
    ('Odaberi drzavu iz koje se trazi viza i trazenu lokaciju po zahtjevu za datum'
        , async t => { 
            const countryFrom = visaPageObject.getElementByLabelName('From Country', allInputs);
            const countryTo = visaPageObject.getElementByLabelName('To Country', allInputs)
            const requestDate = visaPageObject.getElementByLabelName('Date', allInputs)
       
        await t
            .wait(3000)
            .click(countryFrom)
            .expect((await visaPageObject.getAllSearchResults()).count)
            .gt(1)

        await t
            .click(await visaPageObject.selectCountryByText('from_country','Croatia'))
            .wait(2000)
            .click(countryTo)

        await t
            .click(await visaPageObject.selectCountryByText('to_country', 'Afghanistan'))
            .wait(2000)

        await t
            .expect(requestDate.exists)
            .ok("Ne postoji request date problem")
        await t.click(requestDate)
        const selectedDate = Object.values(await visaPageObject.getAvailableCheckInOutDates(2))[1]
        await t
            .wait(1000)
            .click(Object.values(await visaPageObject.getAvailableCheckInOutDates(2))[0])
        
        await t.click(Selector('span').withText(' Submit').parent('button'))
        visaPageObject.updatedLink = visaPageObject.redirectLinkTours(selectedDate);
        console.log(`page object 1 ti je ${visaPageObject.updatedLink}`);
        await t.wait(5000);

})

test.meta({testType: 'regression', severity: 'medium', author:'ivan'})
    /*.before(async t => {
        await t
            .wait(5000)
            .navigateTo("https://phptravels.net/visa/submit/af/ax/18-05-2022")
            .wait(3000)
            .expect((ClientFunction(() => window.location.href)()))
            .eql(visaPageObject.updatedLink)
    })*/
    ('Provjera da li se submit form prijavljuje, njegova ispunjenost i ispravnost linka'
    , async t => {
        await t
            .wait(5000)
            .navigateTo(visaPageObject.updatedLink)
            .wait(3000)
            .expect((ClientFunction(() => window.location.href)()))
            .eql(visaPageObject.updatedLink)

        const allFields = await submitFormPageObject.getAllData();
        const firstName = submitFormPageObject.getElementByLabelName('First Name', allFields);
        const lastName = submitFormPageObject.getElementByLabelName('Last Name', allFields);
        const email = submitFormPageObject.getElementByLabelName('Email', allFields);
        const phone = submitFormPageObject.getElementByLabelName('Phone', allFields);
        const date = submitFormPageObject.getElementByLabelName('Date', allFields);
        const notes = submitFormPageObject.getElementByLabelName('Notes', allFields);
        
        await t
            .expect((submitFormPageObject.getSubmitFormTitle()).innerText).contains('Submission Form')
            .expect(await submitFormPageObject.getFlightFromToLocation().nth(0).innerText)
            .eql(visaPageObject.countries.from_country)
            .expect(await submitFormPageObject.getFlightFromToLocation().nth(1).innerText)
            .eql(visaPageObject.countries.to_country)
            .expect(await submitFormPageObject.getSubmissionDate())
            .eql(visaPageObject.updatedLink.match(/\d{2}-\d{2}-\d{4}/)[0])
        
        await t
            .typeText(firstName, "Luka")
            .typeText(lastName, "Lukic")
            .typeText(email, 'lukalukic@gmail.com')
            .typeText(phone, '0918402840')
            .click(date)

        await t
            .wait(500)
            .click(Object.values(await submitFormPageObject.getAvailableCheckInOutDates(2))[0])
            .typeText(notes, 'test note')
            .wait(500)

        await t.click(Selector('span').withText(' Submit').parent('button'))  
        
        await t
            .expect((ClientFunction(() => window.location.href)()))
            .eql("https://phptravels.net/success/visa")
        
 })

 test.meta({testType: 'regression', severity: 'medium', author:'ivan'})
    ('Test ne smije prikazat success form submitted ako se ne unesu svi valjani podaci'
    , async t => {
        await t
            .navigateTo(visaPageObject.updatedLink)
            .wait(500)

        const allFields = await submitFormPageObject.getAllData();
        const firstName = submitFormPageObject.getElementByLabelName('First Name', allFields);
        const lastName = submitFormPageObject.getElementByLabelName('Last Name', allFields);
        const email = submitFormPageObject.getElementByLabelName('Email', allFields);
        const phone = submitFormPageObject.getElementByLabelName('Phone', allFields);
        
        await t
            .typeText(firstName, "Luka")
            .typeText(lastName, "Lukic")
            .typeText(email, 'lukalukic@gmail.com')
            .typeText(phone, '0918402840')

        await t.click(Selector('span').withText(' Submit').parent('button'))  
        
        await t
            .expect((ClientFunction(() => window.location.href)()))
            .notEql("https://phptravels.net/success/visa")
        
 })


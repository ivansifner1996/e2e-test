import { Selector, ClientFunction, t } from "testcafe";
import ConfigData from "../../config_main/testcafe-config";
import { BaseObject } from "./base-object";
import { DateComparement } from "./shared/common-selectors";


export default class SubmitFormPageObject {

    constructor (selector){
        this.selector = selector;
        this.dataComparement = DateComparement.get();

    }
    
    static get(parent = Selector('body')){
        const selector = parent.find('form')
            .withAttribute('action', 'https://phptravels.net/submit/visa')
        return new SubmitFormPageObject(selector);
    }
    
    getLabel(){
        return this.selector.find('.author__title')
            .child('strong')
            .innerText;
    }

    async getCityInput(){
        const city = Selector('.select2-search__field').with({timeout: 3000});
        return city;
    }

    async getAllData(){
        const datesList = new Map();
        const allInputs = await this.selector
            .child('.row')
            .find('.form-group')
            .with({timeout : 10000})
        for(let i =0; i < await allInputs.count; i++){
            const inputLabel = await allInputs.nth(i)
            .prevSibling('label')
            .with({timeout: 5000});
            console.log(await inputLabel.innerText)
            datesList.set(await inputLabel.innerText,allInputs.nth(i));
            }
        return datesList;
    }


    getSubmitFormTitle(){
        return Selector('.title');
    }

    getFlightFromToLocation(){
        return Selector('.section-heading')
            .nth(0)
            .child('h2')
            .child('strong')
        //return Selector('h2').withAttribute('class', 'sec__title_list').child('strong')
    }

    getSubmissionDate(){
        return Selector('.sec__title_list')
            .nextSibling('h5')
            .innerText;
        //return string.match(/\d{2}-\d{2}-\d{4}/)
    }

    async getAllData(dateForm = this.selector){
        const datesList = new Map();
        const allInputs = await dateForm.child('.row')
            .find('.form-group')
            .with({timeout : 10000})
        for(let i =0; i < await allInputs.count; i++){
            const inputLabel = await allInputs.nth(i)
            .prevSibling()
            .with({timeout: 5000});
            datesList.set(await inputLabel.innerText,allInputs.nth(i));
            }
        return datesList;
    }

    async getAvailableCheckInOutDates(nth) {
        const datePicker = Selector('.datepicker')
            .withAttribute('style', /display: block;/)
            .find('tbody')
            .child('tr')
            .nth(nth)
            .child('td')
            .with({timeout : 8000})
        const day = await datePicker.nth(5).innerText;
        console.log(`sto imam budale ${day}`);
        const monthYear = await this.getSelectedDateValue(datePicker).innerText;
        const splittedMonthYear = monthYear.split(" ");
        const connectedDate = this.dataComparement.connectDate(day, splittedMonthYear[0], splittedMonthYear[1]);
        return Promise.all([datePicker.nth(5), connectedDate])
            .then(function (data){
            return {
                'datePickr' : data[0],
                'day' : data[1]
            }
        })
    }

    getSelectedDateValue(selectedDate){
        const day = selectedDate.innerText
        const monthYear = selectedDate.nth(5)
            .parent('tr')
            .parent('tbody')
            .prevSibling('thead')
            .child('tr')
            .nth(0)
            .child('.switch')
        return monthYear;
    }

    async selectInputByIndex(index){
        return ((await this.getAllSearchResults()).nth(index).with({timeout : 7000}))
    }

    async getAllSearchResults(){
        const searchResults = Selector('.select2-results__options')
            .child('li')
            .with({timeout: 3000});
        return searchResults
    }

    getElementByLabelName(type, dejtovi){
        switch(type){
            case 'First Name':
                console.log(`first name ti je ${dejtovi.get('First Name')}`)
                return dejtovi.get('First Name');
            case 'Last Name' :
                return dejtovi.get('Last Name');
            case 'Email':
                return dejtovi.get('Email')
            case 'Phone':
                return dejtovi.get('Phone')
            case 'Date':
                return dejtovi.get('Date')
            case 'Notes':
                return dejtovi.get('Notes');
            default:
                return dejtovi;             
        }
    }



    async isExists() {
        return await this.selector;
    }

}
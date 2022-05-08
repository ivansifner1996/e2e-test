import { Selector, ClientFunction, t } from "testcafe";
import ConfigData from "../../config_main/testcafe-config";
import { DateComparement } from "./shared/common-selectors";
import { BaseObject } from "./base-object";

export default class FlightPageModel {
    date = null;
    passengers = {}
    constructor(selector, regularDate = undefined){
        this.homepage = `${ConfigData.appUrl}/flights`
        this.selector = selector;
        this.location = ClientFunction(() => document.location.href);
        this.searchForm = this.selector.find('.main_search')
        this.dataComparement = DateComparement.get();

    }

    static get(parent = Selector('body')){
        const selector = parent.find('h2')
            .withText('SEARCH FOR BEST FLIGHTS')
            .nextSibling('#fadein')
            .child('form')
        return new FlightPageModel(selector)
    }

    getFlightsTitle(){
        return this.selector.parent('div').prevSibling('h2').with({timeout : 7000});
    }

    async selectDateInput(index){
        return this.selector.find()
    }

    async selectInputByIndex(index){
        return ((await this.getAllSearchResults()).nth(index).with({timeout : 7000}))
    }

    async getAvailableCheckInOutDates(nth) {
        const datePicker = Selector('.datepicker')
            //.withAttribute('style', "display: block; top: 343.891px; left: 768.656px;")
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

    async getRoundTripRadioButton(){
        return this.selector.find('#round-trip')
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

    getCurrentPath(){
        const getWindowLocation = ClientFunction(() => window.location);
        return getWindowLocation;
    }
    getSelectedCityElementByPlaceholder(cityElement, placeholder){
        return cityElement.find('input')
            .withAttribute('placeholder', placeholder);
    }

    async getAllRegularDates(){
        const datesList = new Map();
        const allInputs = await this.selector.child('.row')
            .nth(1)
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


    async getCityInput(placeholder){
        const city = Selector('input')
            .withAttribute('placeholder', placeholder)
            .with({timeout: 3000});
        return city;
    }

    async getAllSearchResults(){
        const searchResults = Selector('.autocomplete-location')
            .with({timeout: 3000});
        return searchResults
    }
    async findCity(cityInput, city){
        
    }

    async clickOnInput(){

    }

    getElementByLabelName(type, dejtovi){
        switch(type){
            case 'Flying From':
                console.log(' u flying formi si');
                return dejtovi.get('Flying From');
            case 'To Destination' :
                console.log("u destinaciji si");
                return dejtovi.get('To Destination');
            case 'Departure Date':
                return dejtovi.get('Departure Date')
            case 'Passengers' : 
                return dejtovi.get('Passengers')
            default:
                return dejtovi;             
        }
    }

    async returnDateForm(index){
        if(this.regularDate[index].exists() && 
            this.regularDate[index].find()){
            return this.regularDate[index]
        }
    }

    async getValue(){
        return this.selector.find('')
    }

    async isExists() {
        return await this.selector;
    }

    setDate(date){
        this.date = date;
    }

    setPassengers(passengers){

    }

}
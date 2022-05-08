import { Selector, ClientFunction, t } from "testcafe";
import ConfigData from "../../config_main/testcafe-config";
import { DateComparement } from "./shared/common-selectors";
import { BaseObject } from "./base-object";

export default class OrderDatePageModel {

    constructor(selector, regularDate = undefined){
        this.homepage = `${ConfigData.appUrl}/hotels`
        this.selector = selector;
        this.location = ClientFunction(() => document.location.href);
        this.dataComparement = DateComparement.get();
        this.dateOrderForm = this.selector.find('.main_search');

    }

    static get(parent = Selector('body')){
        const selector = parent.find('#hotels-search')
        return new OrderDatePageModel(selector)
    }

    getHotelTitle(){
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
        console.log(`month year je ${connectedDate}`);
        console.log(await datePicker.nth(2).innerText);
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
        //console.log(`month year je ${await monthYear.innerText}`);
        return monthYear;
    }

    getCurrentPath(){
        const getWindowLocation = ClientFunction(() => window.location);
        return getWindowLocation;
    }
    getSelectedCityElement(cityElement){
        return cityElement.find('#select2-hotels_city-container')
    }

    async getAllRegularDates(dateForm = this.dateOrderForm){
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
        //return new OrderDatePageModel(this.selector, datesList)
    }


    async getCityInput(allInputs){
        const city = Selector('.select2-search__field').with({timeout: 3000});
        return city;
    }

    async getAllSearchResults(){
        const searchResults = Selector('.select2-results__options')
            .child('li')
            .with({timeout: 3000});
        return searchResults
    }
    async findCity(cityInput, city){
        
    }

    async clickOnInput(){

    }

    getElementByLabelName(type, dejtovi){
        switch(type){
            case 'City Name': 
                return dejtovi.get('City Name');
            case 'Checkin' :
                return dejtovi.get('Checkin');
            case 'Checkout':
                return dejtovi.get('Checkout')
            case 'Travellers' : 
                return dejtovi.get('Travellers')
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

}
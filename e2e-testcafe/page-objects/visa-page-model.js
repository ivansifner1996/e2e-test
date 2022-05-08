import { Selector, ClientFunction, t } from "testcafe";
import ConfigData from "../../config_main/testcafe-config";
import { BaseObject } from "./base-object";
import { DateComparement } from "./shared/common-selectors";


export default class VisaPageObject {

    updatedLink = "";
    constructor (selector){
        this.selector = selector;
        this.homePage = `${ConfigData.appUrl}/visa`;
        this.dataForm = this.selector.find('.main_search');
        this.dataComparement = DateComparement.get();
        this.countries = {
            "from_country" : "select country",
            "to_country" : "select country"
        }
    }
    
    static get(parent = Selector('body')){
        const selector = parent.find('#visa-submit')
        return new VisaPageObject(selector);
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


    getToursTitle(){
        return this.selector.parent('div').prevSibling('h2').with({timeout : 7000});
    }

    async getAllData(dateForm = this.dataForm){
        const datesList = new Map();
        const allInputs = await dateForm.child('.row')
            .find('.form-group')
            .with({timeout : 10000})
        for(let i =0; i < await allInputs.count; i++){
            const inputLabel = await allInputs.nth(i)
            .prevSibling()
            .with({timeout: 5000});
            console.log(await inputLabel.innerText);
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

    async selectCountryByText(source, country){
        console.log(`country 1 ti je ${country}`);
        console.log(Object.values((await this.getCountryAndAbbr(source, country)))[1]);
        this.countries[source] = Object.values((await this.getCountryAndAbbr(source, country)))[1]
        return (Object.values((await this.getCountryAndAbbr(source, country)))[0])
                .withExactText(country)
                .with({timeout : 7000})
    }

    async getCountryAndAbbr(source, country){
        const searchResults = await this.getAllSearchResults();
        const countryAbb = Selector('select')
            .withAttribute('id', source)
            .child('option')
            .withExactText(country)
            .getAttribute('value');

        console.log(`country abb ti je ${await countryAbb}`);
        return Promise.all([searchResults, await countryAbb])
            .then(function(data){
                return {
                    'countrySelect' : data[0],
                    'countryAbbr' : data[1]
                }
            })
    }


    async getAllSearchResults(){
        const searchResults = Selector('.select2-results__options')
            .child('li')
            .with({timeout: 3000});
        return searchResults;
    }

    getCountryShortenName(){

    }

    getElementByLabelName(type, dejtovi){
        switch(type){
            case 'From Country':
                console.log(' u from country si');
                return dejtovi.get('From Country');
            case 'To Country' :
                console.log("u country si");
                return dejtovi.get('To Country');
            case 'Date':
                return dejtovi.get('Date')
            default:
                return dejtovi;             
        }
    }

    redirectLinkTours(date){
        var editedDate = ('0' + date.getDate()).slice(-2) + '-' + 
            ('0' + (date.getMonth()+1)).slice(-2) + '-' + date.getFullYear();
        return (`${this.homePage}/submit/${this.countries.from_country}/${this.countries.to_country}/${editedDate}`)
    }



    async isExists() {
        return await this.selector;
    }

}
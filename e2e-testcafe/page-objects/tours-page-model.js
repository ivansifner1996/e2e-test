import { Selector, ClientFunction, t } from "testcafe";
import ConfigData from "../../config_main/testcafe-config";
import { BaseObject } from "./base-object";
import { DateComparement } from "./shared/common-selectors";


export default class ToursPageObject {

    updatedLink = "";
    constructor (selector){
        this.selector = selector;
        this.homePage = `${ConfigData.appUrl}/tours`;
        this.dataForm = this.selector.find('.main_search');
        this.dataComparement = DateComparement.get();
        this.travellers = {
            "adults" : 1,
            "childs" : 0
        }
    }
    
    static get(parent = Selector('body')){
        const selector = parent.find('#tours-search')
        return new ToursPageObject(selector);
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

    async checkIfSearchesContainTerms(searchInput){
        const details = await Selector('#markers').find('.card-body > div > div > h3').innerText;
        const location = await Selector('#markers').find('.card-body > div > div > p').innerText;
        await t
            .expect(details).contains('Zagreb')
            .wait(500)
            .expect(location).contains('Zagreb')
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

    async selectInputByIndex(index){
        return ((await this.getAllSearchResults()).nth(index).with({timeout : 7000}))
    }

    async editTravellers(person, type){
        if(person == 'adult'){
            if(type == 'qtyInc'){
                this.travellers["adults"] = this.travellers["adults"]+1;
            } else{this.travellers["adults"] = this.travellers["adults"]-1}
        }else{
            if(type= 'qtyInc'){
                this.travellers["childs"] = this.travellers["childs"]+1;
            } else{this.travellers["childs"] = this.travellers["childs"]-1}
        }
        return this.getTypeOfTraveller(person, type)
    }

    getTypeOfTraveller(person, adjust){
        return (Selector('.dropdown-menu')
                .withAttribute('style', /display: block;/)
                .child('.dropdown-item')
                .nth(person == 'adult' ? 0 : 1)
                .find(`.${adjust}`));
    }

    async getAllSearchResults(){
        const searchResults = Selector('.select2-results__options')
            .child('li')
            .with({timeout: 3000});
        return searchResults
    }

    getElementByLabelName(type, dejtovi){
        switch(type){
            case 'Destination':
                console.log(' u flying formi si');
                return dejtovi.get('Destination');
            case 'Date' :
                console.log("u destinaciji si");
                return dejtovi.get('Date');
            case 'Travellers':
                return dejtovi.get('Travellers')
            default:
                return dejtovi;             
        }
    }

    redirectLinkTours(date){
        var editedDate = ('0' + date.getDate()).slice(-2) + '-' + 
            ('0' + (date.getMonth()+1)).slice(-2) + '-' + date.getFullYear();
        return (`${this.homePage}/en/usd/zagreb/${editedDate}`)
    }

    async getCurrentPath(){
        ClientFunction(() => document.location.href);
    }


    async isExists() {
        return await this.selector;
    }

}
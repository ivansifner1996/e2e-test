import { Selector } from "testcafe";

export class DateComparement {

    constructor(parent){
        this.selector = parent;
        this.month = {
            "January" : 1,
            "February": 2,
            "March": 3,
            "April": 4,
            "May": 5,
            "June": 6,
            "July": 7,
            "August": 8,
            "September": 9,
            "October": 10,
            "November": 11,
            "December": 12
        }
        
    }
    static get(parent = Selector('body')){
        return new DateComparement(parent)
    }

    connectDate(day, month, year){
        const monthByName = this.month[month];
        return new Date(year, monthByName-1, day)
    }

    async getDateValue(dateInput){
        const stringDate = await dateInput
            .child('input')
            .getAttribute('value')
        console.log(`month za May ti je ${this.month["May"]}`);
        const parsedDate = stringDate.split('-')
        return new Date(parsedDate[2], parsedDate[1]-1, parsedDate[0])
    }

}
import { Selector, t } from "testcafe";

export class CommonHeader {

    constructor(parent){
        this.selector = parent;
        
    }
    static get(parent = Selector('body')){
        return new CommonHeader(parent.find('.header-top-content').nth(1))
    }

    async selectEnglishHeader(){
        const dropDown = this.selector.find('.dropdown');
        await t
            .click(dropDown);
        const language = dropDown.find('.dropdown-menu li')
            .child('a')
            .withAttribute('href', /lang-en/)
        return language;
    }
}
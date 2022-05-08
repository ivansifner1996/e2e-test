import { Selector, t } from "testcafe";

export class CommonButton {

    constructor(parent){
        this.selector = parent;
        
    }
    static get(spanLabel = Selector('span').withText(' Search')
        .with({timeout: 5000})){
        return new CommonButton(spanLabel.parent('button'))
    }

    async clickOnButton(){
        await t.click(this.selector);
    }
}
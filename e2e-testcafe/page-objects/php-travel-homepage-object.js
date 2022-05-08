import { Selector, ClientFunction, t } from "testcafe";
import ConfigData from "../../config_main/testcafe-config";
import { BaseObject } from "./base-object";

export default class PhpHomepageObject {
    selector = Selector('body');
    homePage = `${ConfigData.appUrl}/`;
    getLocation = ClientFunction(() => document.location.href);
    links = ["", "hotels", "flights", "tours", "visa", "blog", "offers"]

    static get(parent = Selector('body')){
        return new PhpHomepageObject(parent);
    }
    
    getLabel(){
        return this.selector.find('.author__title')
            .child('strong')
            .innerText;
    }

    getLocation(){
        return this.getLocation;
    }

    getLinks(){ return this.selector.find('a').withAttribute('title', 'home') }



    async getCurrentPath(){
        ClientFunction(() => document.location.href);
    }


    async isExists() {
        return await this.selector.exists.ok();
    }

}
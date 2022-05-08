import { Role, Selector } from "testcafe";

import ConfigData from "../../config_main/testcafe-config";
import { TestCafeConfig } from "./test-cafe-config";
import loginPageModel from "../page-objects/login-page-model";

export const loginPage = Role(
    TestCafeConfig.appUrl,
    async t => {
        console.log("Navigiras na", TestCafeConfig.appUrl);
        await t
            .maximizeWindow()
            //expect(Selector('a').withText('Login')).ok()
            .click(loginPageModel.login2)
            .typeText(loginPageModel.userNameInput, ConfigData.username)
            .typeText(loginPageModel.userNamePassword, ConfigData.password)
            .wait(1000)
            .click(loginPageModel.loginSignIn);
            console.log("Autentificiras se na sajt");
            //await t.navigateTo(TestCafeConfig.appUrl);
    },
        {preserveUrl : true}
);
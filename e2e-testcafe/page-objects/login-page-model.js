import { Selector, t } from "testcafe"

class LoginPageModel{
        userNameInput = Selector('.contact-form-action').nth(0)
                .child('form')
                .child('.input-box')
                .child('.form-group')
                .child('input')
        
        userNamePassword = Selector('.contact-form-action').nth(0)
                .child('form')
                .child('.input-box')
                .nth(1)
                .child('.form-group')
                .child('input')

        loginButton = Selector('a').withText('Login');
        login2 = Selector('.header-top-content').nth(1)
                .child(0)
                .child(5)

        loginSignIn = Selector('button').withText('Login')



}

export default new LoginPageModel();
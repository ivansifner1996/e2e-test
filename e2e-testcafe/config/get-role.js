import { loginPage } from "./login-page";
import { TestCafeConfig } from "./test-cafe-config";

export function getRole() {
    if(TestCafeConfig.loginPage === true){
        return loginPage;
    }
}
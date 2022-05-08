import ConfigData from "../../config_main/testcafe-config"

export const TestCafeConfig = {
    ...ConfigData,
    loginPage : true,
    defaultTimeout : 15000,
    loggerSettings : {
        creation: true,
    edit: true,
    navigation: true,
    viewCache: true,
    step: true,
    retryWhen: true,
    requestSuccess: true,
    requestError: true,
    tokenInfo: true,
    createdAdded: true,
    request: true,
    requestFailed: true,
    }
}
import { Selector, t } from "testcafe";

export default  class Shared {

    static async checkIfResultsAreSortedAscending(input){
        console.log(`triggeras funckiju ${input}`);
        const length = await input.count;
        console.log(`duzina je ${length}`)
        for(let i = 0; i < length-1; i++){
            let preceeding = parseFloat((await input.nth(i).innerText).match(/[+-]?\d+(\.\d+)?/).join(""));
            let suceeding = parseFloat((await input.nth(i + 1).innerText).match(/[+-]?\d+(\.\d+)?/).join(""));
            console.log(`preceeding ti je ${preceeding}, a next je ${suceeding}`);
            await t
                .expect(preceeding)
                .lte(suceeding)
        }
    }

}






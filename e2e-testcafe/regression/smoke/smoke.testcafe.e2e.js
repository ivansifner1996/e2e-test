import { getRole } from "../../config/get-role";
import PhpHomepageObject from "../../page-objects/php-travel-homepage-object";

const phpHomepageObject = PhpHomepageObject.get();

fixture('php travels test login')
    .beforeEach(async t => {
        await t.useRole(getRole());
        await t.wait(2000);
    });

test.meta({testType: 'smoke', severity: 'high', author:'ivan'})
    ('Provjeri da li se aplikacija uspjesno ucitava i ispravnost linka', async t => {
        await t.expect(phpHomepageObject.isExists).ok('Home Page postoji')
            .expect(phpHomepageObject.getLabel()).contains('Demo')
        
        await t.expect(phpHomepageObject.getLocation()).contains(phpHomepageObject.homePage+"account/dashboard");
})

test.meta({testType: 'smoke', severity: 'medium', author:'ivan'})
    ('Da li su glavni linkovi dostupni i mogu li se obici', async t => {
        const links = phpHomepageObject.getLinks();
        for(let i=0; i < await links.count; i++){
            await 
                t.wait(2000)
                .click(links.nth(i))
                .expect(phpHomepageObject.getLocation())
                .contains(phpHomepageObject.homePage+phpHomepageObject.links[i], 
                    'link je pravilno prikazan');
                }
    })
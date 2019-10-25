const puppeteer = require('puppeteer');
function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("http://www.punknight.com/");
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelector("body > main");
                items.forEach((item) => {
                    /*
                    results.push({
                        url:  item.getAttribute('href'),
                        text: item.innerText,
                    });*/
                    console.log(item);
                });
                return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
run().then(console.log).catch(console.error);
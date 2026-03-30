const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
        
        console.log('Navigating to http://localhost:5175...');
        await page.goto('http://localhost:5175', { waitUntil: 'networkidle0' });
        
        const content = await page.content();
        console.log('Final HTML length:', content.length);
        console.log('Body HTML:', await page.evaluate(() => document.body.innerHTML));
        
        await browser.close();
        console.log('Done.');
    } catch(err) {
        console.error('SCRIPT ERROR:', err);
    }
})();

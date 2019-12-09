const puppeteer = require('puppeteer');

(async () => {
	let launchOptions = { headless: false, args: ['--start-maximized'] };
	
	const browser = await puppeteer.launch(launchOptions);
	const page = await browser.newPage();
	
	// set viewport and user agent (just in case for nice viewing)
	await page.setViewport({width: 1366, height: 768});
	await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
	
	// prepare source and target currency
	let currencyCodeSource = 'BTC', currencyCodeTarget = 'USD';

	// use Google to do currency exchange
	// currently data in Google provided by Morningstar for Currency and Coinbase for Cryptocurrency
	await page.goto(`https://www.google.com/search?hl=en&q=${currencyCodeSource}+to+${currencyCodeTarget}`);
	
	// wait until the knowledge about currency is ready on DOM
	await page.waitForSelector('#knowledge-currency__updatable-data-column');
	await page.waitFor(2000);

	// get the currency exchange data
	const currencyExchange = await page.evaluate(() => {
		return {
			    'currency_source_value': parseFloat(document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('input')[0].getAttribute('value')),
			    'currency_source_freebase_id': document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[0].options[document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[0].selectedIndex].getAttribute('value'),
			    'currency_source_name': document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[0].options[document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[0].selectedIndex].text,
			    'currency_target_value': parseFloat(document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('input')[1].getAttribute('value')),
			    'currency_target_freebase_id': document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[1].options[document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[1].selectedIndex].getAttribute('value'),
			    'currency_target_name': document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[1].options[document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[1].selectedIndex].text
			   }
	});

	// show the results
	console.log(currencyExchange);

	await page.waitFor(1000);
	await browser.close();
})();

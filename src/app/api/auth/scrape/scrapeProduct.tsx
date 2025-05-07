const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.use(express.json());

const fetchProductDetails = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Example selectors - you need to adjust this based on the target page
  await page.waitForSelector('.product-title');
  await page.waitForSelector('.product-price');
  await page.waitForSelector('.product-image');

  const productData = await page.evaluate(() => {
    const productNameElement = document.querySelector('.product-title-selector');
    const productPriceElement = document.querySelector('.product-price-selector');
    const productImageElement = document.querySelector('.product-image-selector img');
  
    // Cast elements to HTMLElement before accessing innerText or src
    const productName = productNameElement ? (productNameElement as HTMLElement).innerText : 'No Name';
    const productPrice = productPriceElement ? (productPriceElement as HTMLElement).innerText : 'No Price';
    const productImage = productImageElement ? (productImageElement as HTMLImageElement).src : '';
  
    return {
      name: productName,
      price: productPrice,
      image: productImage,
    };
  });
  await browser.close();

};

app.post('/api/fetch-product', async (req, res) => {
  const { url } = req.body;
  try {
    const productData = await fetchProductDetails(url);
    res.json(productData);  // Return the scraped data as a JSON response
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:3000');
});

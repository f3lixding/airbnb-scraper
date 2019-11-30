const express = require('express');
const router = express.Router();
const {getPageListings, getListingDetails} = require('../scraper/index.js');
const fs = require('fs');
const listingPagesDir = '../scrapedContent/listingPagesDir.txt';
const Promise = require('bluebird');

const fsAsync = Promise.promisifyAll(fs);

router.get('/scrape', async (req, res, next) => {
  // fsAsync.readFileAsync(listingPagesDir)
  //   .then((content) => {

  //   }).catch((err) => {

  //   })
  const listingPages = await getPageListings();
  // fs.writeFile(listingPagesDir, JSON.stringify(listingPages), (err) => {
  //   if (err) {
  //     console.log('error encountered while writing listing page...');
  //   } else {
  //     console.log('listing page successfully saved!');
  //   }
  // })
  const pageDetails = await getListingDetails(listingPages);
  // gather info scraped and write it into a file locally
  
  console.log('get router has been used...');
});

module.exports = router;   

// .children[5].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[0].className

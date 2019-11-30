const express = require('express');
const router = express.Router();
const {getPageListings, getListingDetails} = require('../scraper/index.js');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const fsAsync = Promise.promisifyAll(fs);

router.get('/scrape', async (req, res, next) => {
  const listingPages = await getPageListings();
  fsAsync.writeFileAsync(path.resolve(__dirname, '../data/listing-pages.txt'), JSON.stringify(listingPages))
    .then((result) => {
      console.log('list pages links successfully recorded!');
    })
    .catch((err) => {
      console.log('error encountered during writing of list pages...');
    });
    const pageDetails = await getListingDetails(listingPages);
    // gather info scraped and write it into a file locally
    fsAsync.writeFileAsync(path.resolve(__dirname, '../data/page-details.txt'), JSON.stringify(pageDetails))
      .then((result) => {
        res.status(200).end();
        console.log('page details successfully recorded!');
      })
      .catch((err) => {
        res.status(404).end();
        console.log('error encountered during writing of page details...');
      });
    
  console.log('get router has been used...');
});

router.get('/scrapeonlypagedetails', async (req, res, next) => {
  fsAsync.readFileAsync(path.resolve(__dirname, '../data/listing-pages.txt'))
    .then(async (data) => {
      var deseriazlied = JSON.parse(data);
      const pageDetails = await getListingDetails(deseriazlied);
      return pageDetails;
    })
    .then((data) => {
      debugger;
      return fsAsync.writeFileAsync(path.resolve(__dirname, '../data/page-details.txt'), JSON.stringify(data))
    })
    .then((result) => {
      res.status(200).end();
      console.log('page details successfully recorded!');
    })
    .catch((err) => {
      res.status(404).end();
      console.log('error encountered during writing of page details...', err);
    });
});

module.exports = router;   
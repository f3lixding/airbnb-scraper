const express = require('express');
const router = express.Router();
const getResults = require('../scraper');

router.get('/scrape', async (req, res, next) => {
  const results = await getResults();
  // res.render('index', results);
  console.log(results);
  console.log('get router has been used...');
});

module.exports = router;   
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true, pollInterval: 50, height: 1200, width: 1440});

const siteUrl = "https://www.airbnb.com/s/Sunnyvale--CA--United-States/homes?adults=0&children=0&infants=0&place_id=ChIJO13QqUW2j4ARosN83Sb7jXY&refinement_paths%5B%5D=%2Fhomes&search_type=section_navigation";
const individualRoomClickableDOM = '._ttw0d';
const nextPageDOM = '._r4n1gzb';
const totalNumberOfPagesDOM = '._1bdke5s';
// fetch the page
const getPageListings = async () => {
  return nightmare
    .goto(siteUrl)
    .cookies.set({
      name: '__svt',
      value: '636',
      path: '/query',
      secure: true
    })
    .wait(individualRoomClickableDOM, totalNumberOfPagesDOM, nextPageDOM)
    .evaluate((totalNumberOfPagesDOM) => {
      var pageArray = document.querySelectorAll(totalNumberOfPagesDOM);
      // var totalNumberOfPages = Number(pageArray[pageArray.length - 1].innerText);
      var totalNumberOfPages = 1;
      return totalNumberOfPages;
    }, totalNumberOfPagesDOM)
    .then((result) => {
      var helperArray = new Array(result).fill(nextPageDOM);
      var linkToNextPage = siteUrl;
      var linkBin = [];
      var lastPage = result;
      return helperArray.reduce((accumulator, toGo) => {
        return accumulator.then((results) => {
          return nightmare
            .goto(linkToNextPage)
            .wait(individualRoomClickableDOM, totalNumberOfPagesDOM)
            .evaluate((individualRoomClickableDOM, lastPage, toGo) => {
              var currentPageDOMList = Array.from(document.querySelectorAll(individualRoomClickableDOM));
              var currentPagehrefList = currentPageDOMList.map((element) => {
                return element.children[0].href;
              });
              var currentPage = Number(document.querySelector('._e602arm').innerText);
              var nextPage = currentPage < lastPage ? document.querySelector(toGo).children[0].href : null;
              return {currentPagehrefList, nextPage};
            }, individualRoomClickableDOM, lastPage, toGo)
            .then(({currentPagehrefList, nextPage}) => {
              linkToNextPage = nextPage;
              linkBin = linkBin.concat(currentPagehrefList);
              return linkBin;
            });
        });
      }, Promise.resolve([]))
      .then((result) => {
        return result;
      });
    });
}

const gallerySelector = '#FMP-target';
const titleSelector = '._18hrqvin';
const typeSelector = '._tqmy57';


const getListingDetails = async (listingArray) => {
  var listingArray = listingArray.slice(0, 10);
  var listingDetailArray = [];
  return listingArray.reduce((accumulator, singleListingURL) => {
    return accumulator.then((results) => {
      return nightmare
        .goto(singleListingURL)
        .cookies.set({
          name: '__svt',
          value: '636',
          path: '/query',
          secure: true
        })
        .wait(1500)
        .evaluate((gallerySelector, titleSelector, typeSelector) => {
          var selector = document.querySelector(gallerySelector).className;
          var picNodes = document.querySelectorAll(`.${selector}`);
          var picNodesArray = Array.from(picNodes);
          var interiorPicLinks = picNodesArray.map((picNode) => {
            return picNode.src;
          });
          var title = document.querySelector(titleSelector).innerText;
          var summaryDiv = document.querySelector('#summary');
          var type = summaryDiv === null ? document.querySelectorAll('span')[30].parentElement.innerText : summaryDiv.nextElementSibling.innerText.split('\n').slice(0, 4).join('-');
          var priceDOM = document.querySelector('._doc79r');
          var reviewDOM = document.querySelector('._1iv05u9z');
          var price = priceDOM === null ? document.querySelector('._83jges').innerText.split(' ')[0] : document.querySelector('._doc79r').innerText;
          var review = reviewDOM === null ? document.querySelector('._goo6eo').innerText : document.querySelector('._1iv05u9z').innerText;
          return {interiorPicLinks, title, type, price, review};
        }, gallerySelector, titleSelector, typeSelector)
        .then((results) => {
          listingDetailArray.push(results);
          return listingDetailArray
        })
    })
  }, Promise.resolve([]))
  .then((result) => {
    debugger;
  })
}

// return the organized data
module.exports.getPageListings = getPageListings;
module.exports.getListingDetails = getListingDetails;


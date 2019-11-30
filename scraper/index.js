const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true, pollInterval: 50});

const siteUrl = "https://www.airbnb.com/s/Sunnyvale--CA--United-States/homes?adults=0&children=0&infants=0&place_id=ChIJO13QqUW2j4ARosN83Sb7jXY&refinement_paths%5B%5D=%2Fhomes&search_type=section_navigation";
const individualRoomClickableDOM = '._ttw0d';
const nextPageDOM = '._r4n1gzb';
const totalNumberOfPagesDOM = '._1bdke5s';
// fetch the page
const getResults = async () => {
  return nightmare
    .goto(siteUrl)
    .cookies.set({
      name: '__svt',
      value: '636',
      path: '/query',
      secure: true
    }).wait(individualRoomClickableDOM, totalNumberOfPagesDOM, nextPageDOM)
      .evaluate((totalNumberOfPagesDOM) => {
        var pageArray = document.querySelectorAll(totalNumberOfPagesDOM);
        var totalNumberOfPages = Number(pageArray[pageArray.length - 1].innerText);
        return totalNumberOfPages;
      }, totalNumberOfPagesDOM)
      .then((result) => {
        var helperArray = new Array(result).fill(nextPageDOM);
        var linkToNextPage = siteUrl;
        var linkBin = [];
        var lastPage = result;
        return helperArray.reduce((accumulator, toGo, index) => {
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
        }, Promise.resolve([])).then((result) => {
          debugger;
        });
      });
}

// return the organized data
module.exports = getResults;


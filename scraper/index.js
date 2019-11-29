const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true, pollInterval: 50});

const siteUrl = "https://www.airbnb.com/s/Sunnyvale--CA--United-States/homes?adults=0&children=0&infants=0&place_id=ChIJO13QqUW2j4ARosN83Sb7jXY&refinement_paths%5B%5D=%2Fhomes&search_type=section_navigation";
const className = '._1jl4bye9';
const imgClassName = '._1i2fr3fi';

// fetch the page
const getResults = async () => {
  return nightmare
    .goto(siteUrl)
    .cookies.set({
      name: '__svt',
      value: '636',
      path: '/query',
      secure: true
    }).wait(imgClassName).evaluate((selector1, selector2) => {
      var roomList = document.querySelectorAll(selector1);
      var imageList = document.querySelectorAll(selector2);
      var tempArray = [];
      for (var i = 0; i < roomList.length; i++) {
        tempArray.push(roomList[i].innerText + '\n' + imageList[i].style.backgroundImage.substring(5, imageList[i].style.backgroundImage.length - 2));
      }
      return String(tempArray);
    }, className, imgClassName).end().then((result) => {
      return result;
    }).catch((err) => {
      console.log(err);
    });
}

// return the organized data
module.exports = getResults;


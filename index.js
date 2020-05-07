require('dotenv').config();

var pupp = require('puppeteer');
var parse = require('node-html-parser');

const iplocation = require('iplocation');

var express = require('express');
var app = express();
const port = process.env.PORT;
const productionPort = 80;

async function initBrowser() {
    var songJson = {"title": "", "artist": ""};
    var page;
    var browser;
    
    if (port == productionPort) {
      console.log("API is running in production mode. Watch out for overuse of the ipapi service!")
    } else {
      console.log("API is running in development mode.");
    }

    try {
      browser = await pupp.launch({ 'args' : [ '--no-sandbox', '--disable-setuid-sandbox' ] });
      page = await browser.newPage();
      console.log("Browser launched.");
      await page.goto('https://www.sbs.com.au/radio/block/chill-full-radio-player', {waitUntil: 'networkidle2'});
      console.log("Website loaded.");
    } catch {
      console.log("Error! Browser failed to Launch!");
    }
    
    app.get('/currentsong', async (req, res) => {
      var finalResponse;
      try {
        await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"]});
        nowPlaying = parse.parse(await page.$eval('.item-current', e => e.innerHTML));
        songJson.title = nowPlaying.querySelector('.title').text;
        songJson.artist = nowPlaying.querySelector('.artist').text;
        finalResponse = songJson;
      }
      catch{
        songJson.title = "ERROR! Contact APTheHunter#8738";
        songJson.artist = "ERROR! Contact APTheHunter#8738";
        console.log("Website reload error! Did Pupp break, or is the website down?");
      }
      finally {
        res.send(finalResponse);
        if (port == productionPort) {
          var location = await iplocation(req.ip);
          console.log("Request from " + location.region.name + ", " + location.country.name + " (" + req.ip + ") recieved and fulfilled.")
        } else {
          console.log("Local request recieved and fulfilled.")
        }
      }
    });

    app.get('/prevsong', async (req, res) => {
      var finalResponse;
      try {
        await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"]});
        nowPlaying = parse.parse(await page.$eval('.item-previous', e => e.innerHTML));
        songJson.title = nowPlaying.querySelector('.title').text;
        songJson.artist = nowPlaying.querySelector('.artist').text;
        finalResponse = songJson;
      }
      catch(e){
        songJson.title = "ERROR! Contact APTheHunter#8738";
        songJson.artist = "ERROR! Contact APTheHunter#8738";
        console.error(e);
        console.log("Website reload error! Did Pupp break, or is the website down?");
      }
      finally {
        res.send(finalResponse);
        if (port == productionPort) {
          try {
            var location = await iplocation(req.ip);
            console.log("Request from " + location.region.name + ", " + location.country.name + " (" + req.ip + ") recieved and fulfilled.")
          } catch {
            console.log("Request from " + req.ip + " recieved and fulfilled. (Is ipapi down/overused?)")
          }
        } else {
          console.log("Local request recieved and fulfilled.")
        }
      }
    });
    
  app.listen(port, () => console.log(`RadioScraper API listening at http://localhost:${port}`))
}

initBrowser();

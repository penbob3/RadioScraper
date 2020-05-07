var pupp = require('puppeteer');
var parse = require('node-html-parser');

var express = require('express');
var app = express();
app.use(express.json());
const port = 3621;


var sampleJson = {
    "payload": {
      "google": {
        "expectUserResponse": false,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": ""
              }
            }
          ]
        }
      }
    }
  }

async function initBrowser() {
    const browser = await pupp.launch();
    const page = await browser.newPage();
    //await page.goto('about:blank');
    await page.goto('https://www.sbs.com.au/radio/block/chill-full-radio-player', {waitUntil: 'networkidle2'});
    
    app.get('/currentsong', async (req, res) => {
        await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"]});
        nowPlaying = parse.parse(await page.$eval('.item-current', e => e.innerHTML));
        var songTitle = nowPlaying.querySelector('.title').text;
        var songArtist = nowPlaying.querySelector('.artist').text;
        var fullSong = songTitle + " by " + songArtist;
        res.send(fullSong);
    });

    app.get('/prevsong', async (req, res) => {
        await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"]});
        nowPlaying = parse.parse(await page.$eval('.item-previous', e => e.innerHTML));
        var songTitle = nowPlaying.querySelector('.title').text;
        var songArtist = nowPlaying.querySelector('.artist').text;
        var fullSong = songTitle + " by " + songArtist;
        res.send(fullSong);
    });

    app.post('/', async (req, res) => {
        console.log(req.body);
        var reqVer = req.body.queryResult.intent.displayName;

        if (reqVer == "getCurrent") {
            await page.reload({ waitUntil: ["networkidle2", "domcontentloaded"]});
            nowPlaying = parse.parse(await page.$eval('.item-current', e => e.innerHTML));
            var songTitle = nowPlaying.querySelector('.title').text;
            var songArtist = nowPlaying.querySelector('.artist').text;
            var fullSong = songTitle + " by " + songArtist;

            var newRes = sampleJson;
            sampleJson.payload.google.richResponse.items[0].simpleResponse.textToSpeech = fullSong;
            res.send(sampleJson);
        }
        
    });
}

initBrowser();

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
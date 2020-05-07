# RadioScraper
Pulls current and previously playing songs from the SBS Chill Radio website  
The song's title and artist name are retrieved.
(I would like to include the album name but unfortunately it's not shown on the website.)  
Uses Express, Puppeteer, node-html-parser and iplocation
# How to use
It works just like any Node app: clone it, run 'npm install', then launch with 'node index.js'  
Don't forget to set the port in a .env file! Otherwise it will default to port 80.   
Endpoints are /currentsong and /prevsong  
Data is returned in a JSON response of the following format (Without the dashes obviously):

```json
{
    "title": "-Song Title-",
    "artist": "-Artist Name-"
}
```

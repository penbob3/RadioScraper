# RadioScraper
Pulls current and previously playing songs from the SBS Chill Radio website  
Uses Express, Puppeteer and node-html-parser  
# How to use
It works just like any Node app: clone it, initialize it and run node index.js  
Endpoints are /currentsong and /prevsong  
Data is returned in a '-Title- by -Artist-' format (excluding ' and - obviously)

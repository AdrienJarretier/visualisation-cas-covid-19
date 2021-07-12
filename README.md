
## [http://evolution-coronavirus.tk/](http://evolution-coronavirus.tk/)

Requirements :

Nodejs 12 : [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

If it is enabled in `localConfig.json`, you need a telegram bot to send notifications to clients [https://core.telegram.org/bots](https://core.telegram.org/bots)

```bash
git clone https://github.com/AdrienJarretier/visualisation-cas-covid-19.git
cd visualisation-cas-covid-19
npm install
node db/createDb.js
```

If `telegram-notifications-bot-controler` is enabled in `localConfig.json` you need to set up the database for registering telegram clients :
```bash
node telegram-notifications-bot-controler/createDb.js
```

Then start the web sever with `npm start`

data from :
[European Centre for Disease Prevention and Control ](https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide)

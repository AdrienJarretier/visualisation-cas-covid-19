# Visualization of covid-19 new cases


## The app

This project is a web application showing daily new cases of covid-19.
It interactively displays new reported contaminations, and allows to :

+ Select a European country of interest (currently France and Germany)

+ Switch between linear and log scales

+ Zoom to see the last month only

+ Overlay a rolling average to denoise and smooth the raw data, that is subjet to strong weekly variations. The window size of this weighted tolling average can be parametrized.

The data is from :
[European Centre for Disease Prevention and Control](https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide)


The app is not deployed online, but it soon will be.


## Requirements to use the app on your PC / server :

### Basic install

Nodejs (v14.17) should be downloaded : [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

Then, clone the repo, enter it, install the required dependencies, and initialize the cases database as follows :

```bash
git clone https://github.com/AdrienJarretier/visualisation-cas-covid-19.git
cd visualisation-cas-covid-19
npm install
node db/createDb.js
```

### Adding telegram notifications

If you intend to use the telegram bot feature to send daily notifications, you have to enable it in `localConfig.json`, AND you need a telegram bot to send notifications to clients [https://core.telegram.org/bots](https://core.telegram.org/bots).

If `telegram-notifications-bot-controler` is enabled in `localConfig.json` you need to set up the database for registering telegram clients :

```bash
node telegram-notifications-bot-controler/createDb.js
```

### Start the app

> Start the web sever with `npm start`


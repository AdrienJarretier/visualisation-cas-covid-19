
## [http://evolution-coronavirus.tk/](http://evolution-coronavirus.tk/)

Requirements :

Nodejs 12 : [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

```bash
git clone https://github.com/AdrienJarretier/visualisation-cas-covid-19.git
cd visualisation-cas-covid-19
cp example-localConfig.json localConfig.json
cp botController/example-config.json botController/config.json
```

Customize `localConfig.json`
Customize `botController/config.json`

```bash
npm install
node db/createDb.js
```

Then start the web sever with `npm start`

data from :
[European Centre for Disease Prevention and Control ](https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide)

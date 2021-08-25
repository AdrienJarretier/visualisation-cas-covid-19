import { get } from './utils.js';

async function select_country(geoid, name, customChart) {

    $('#countriesDropdown button').text(name);

    const cases = await get('api/cases/' + geoid);

    let data = [];
    let xTicksLabels = [];

    for (let c of cases) {
        data.push(c.cases);

        var options = { month: 'short', day: 'numeric', weekday: 'short' };

        xTicksLabels.push((new Date(c.date)).toLocaleDateString('default', options));
    }

    customChart.setData(data, xTicksLabels);
    customChart.setMaxY(customChart.scales.y.max);
}

function disp_countries(countries, customChart) {

    let countriesDropsown = $('#countriesDropdown ul');

    for (let geoid in countries) {

        let c_data = countries[geoid]
        let name = c_data.name

        let dropdownItem = $('<li>')
            .append(
                $('<a class="dropdown-item" href="#">')
                    .text(name)
                    .click(function () {
                        select_country(geoid, name, customChart);
                    })
            );

        countriesDropsown.append(dropdownItem);
    }
}

async function load_countries(customChart) {

    let countries = await get("api/countries");

    disp_countries(countries, customChart);
    let first_geoid = Object.keys(countries)[0];
    let first_name = countries[first_geoid].name;

    await select_country(first_geoid, first_name, customChart);
}

export { load_countries };

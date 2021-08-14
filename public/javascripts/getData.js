import { get } from './utils.js';

function getCases(geoid) {

    return get('api/cases/' + geoid);
}

async function select_country(geoid, name) {
    // drawBarchart(geoid);
    $('#countriesDropdown button').text(name);
}

function disp_countries(countries) {

    let countriesDropsown = $('#countriesDropdown ul');

    for (let geoid in countries) {

        let c_data = countries[geoid]
        let name = c_data.name

        let dropdownItem = $('<li>')
            .append(
                $('<a class="dropdown-item" href="#">')
                    .text(name)
                    .click(function () {
                        select_country(geoid, name)
                    })
            );

        countriesDropsown.append(dropdownItem);
    }
}

async function load_countries() {

    let countries = await get("api/countries");

    disp_countries(countries);
    let first_geoid = Object.keys(countries)[0]
    let first_name = countries[first_geoid].name
    select_country(first_geoid, first_name)
}

export { load_countries };
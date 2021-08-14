import { get } from './utils.js';

// function disp_countries(countries) {

//     let countriesDropsown = $('#dropdown-items');

//     for(let geoid in countries) {

//         let c_data = countries[geoid]
//         let name = c_data.name

//         countriesDropsown.append('a')
//         .attr('href','#')
//         .attr('class','dropdown-item')
//         .html(name)
//         .on('click', function() {
//             select_country(geoid, name)
//         })
//     }
// }

async function load_countries() {

    let countries = await get("api/countries");

    // disp_countries(countries);

    return countries;

    // let first_geoid = Object.keys(countries)[0]
    // let first_name = countries[first_geoid].name
    // select_country(first_geoid, first_name)
}

export { load_countries };
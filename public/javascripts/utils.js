'use strict';

async function get(uri) {

    try {

        const response = await fetch(uri, {
            method: 'GET',
        });

        return await response.json();

    } catch (e) {

        return [];

    }

}

export { get };

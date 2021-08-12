import {Chart} from '/extLibs/chart.js/chart.js-3.5.0.min.js';

// const seed = JSON.parse(localStorage.getItem('seed')) || Random.createEntropy();
// console.log(seed);

// localStorage.setItem('seed', JSON.stringify(seed));

// const mt = Random.MersenneTwister19937.seedWithArray(seed);

function rand() {
    return Math.round(Math.random());

    // const distribution = Random.real(0, 1);
    // return distribution(mt);

}

$(function () {

    const VALUES_COUNT = 100;

    let rawValues = [];

    const labels = [];

    const MAX_RAW_VAL = 5;

    for (let i = 0; i < 1; ++i) {

        rawValues.push(rand(0, MAX_RAW_VAL));
        labels.push(i + 1);
    }

    for (let i = 1; i < VALUES_COUNT; ++i) {

        let tmpvValS = []
        for (let j = 0; j < 20; ++j) {

            tmpvValS.push(rand(0, MAX_RAW_VAL));

        }
        // console.log(tmpvValS);

        tmpvValS.sort((a, b) => {
            return Math.abs(a - rawValues[i - 1]) - Math.abs(b - rawValues[i - 1]);
        });

        // console.log(tmpvValS);

        rawValues.push(tmpvValS[0]);

        labels.push(i + 1);
    }

    let movingAvgDataset = {
        type: 'line',
        label: '',
        backgroundColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(0, 0, 0)',
        data: [],
    };

    const data = {
        labels: labels,
        datasets: [movingAvgDataset, {
            type: 'bar',
            label: 'My First dataset',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132, 0.9)',
            data: rawValues,
            borderWidth: 1,
        }]
    };

    const config = {
        data,
        options: {}
    };

    const myChart = new Chart(
        $('#myChart'),
        config
    );

    function computeMovingAvg() {

        let WINDOW_SIZE = $('#windowWiseSelector').val();

        movingAvgDataset.label = 'Moving Average, k = ' + WINDOW_SIZE;
        movingAvgDataset.data = [];

        let AVG_START = Math.floor(-(WINDOW_SIZE - 1) / 2);
        let AVG_STOP = Math.floor((WINDOW_SIZE - 1) / 2);

        for (let i = 0; i < -AVG_START; ++i) {
            movingAvgDataset.data.push(null);
        }

        for (let i = -AVG_START; i < rawValues.length - AVG_STOP; ++i) {

            let sum = 0;
            for (let j = i + AVG_START; j < i + AVG_STOP + 1; ++j) {

                sum += rawValues[j];
            }
            movingAvgDataset.data.push(sum / (1 + AVG_STOP - AVG_START));
        }

        myChart.update();

    }

    $('#windowWiseSelector').change(computeMovingAvg);

    computeMovingAvg();

});

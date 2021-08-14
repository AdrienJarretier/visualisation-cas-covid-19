import { computeMovingAvg } from './statsCalculations.js';

// const seed = JSON.parse(localStorage.getItem('seed')) || Random.createEntropy();
// console.log(seed);

// localStorage.setItem('seed', JSON.stringify(seed));

// const mt = Random.MersenneTwister19937.seedWithArray(seed);

function rand() {
    return Math.random();

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

    const rawDataset = {
        type: 'bar',
        label: 'My First dataset',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132, 0.9)',
        data: rawValues,
        borderWidth: 1,
    };

    let movingAvgDataset = {
        type: 'line',
        label: '',
        backgroundColor: 'rgb(0, 0, 0)',
        borderColor: 'rgb(0, 0, 0)',
        data: [],
    };

    const data = {
        labels: labels,
        datasets: [movingAvgDataset, rawDataset]
    };

    const config = {
        data,
        options: {}
    };

    const myChart = new Chart(
        $('#barchart'),
        config
    );

    function handleWindowSizeSelectorChange(windowSize) {

        movingAvgDataset.data = computeMovingAvg(rawValues, windowSize);
        movingAvgDataset.label = 'Moving Average, k = ' + windowSize;

        myChart.update();
    }

    $('#windowWiseSelector').change(function () { handleWindowSizeSelectorChange($(this).val()) });

    handleWindowSizeSelectorChange($('#windowWiseSelector').val());

});

'use strict';

function computeMovingAvg(rawValues, windowSize) {

    let movingAvgData = [];

    let sum = 0;

    let AVG_START = 0;
    let AVG_STOP = Math.floor((windowSize - 1) / 2);

    for (let j = AVG_START; j < AVG_STOP + 1; ++j) {

        sum += rawValues[j];
    }

    movingAvgData.push(sum / (AVG_STOP - AVG_START + 1));

    function increment() {
        const MAX_STOP = rawValues.length - 1;

        if (AVG_STOP + 1 - AVG_START >= windowSize || AVG_STOP == MAX_STOP) {
            sum -= rawValues[AVG_START];
            ++AVG_START;
        }

        if (AVG_STOP < MAX_STOP) {
            ++AVG_STOP;
            sum += rawValues[AVG_STOP];
        }

        movingAvgData.push(sum / (AVG_STOP - AVG_START + 1));
    }

    for (let i = 1; i < rawValues.length; ++i) {
        increment();
    }

    return movingAvgData;

}


function computeWeightedMovingAvg(rawValues, windowSize) {

    /**
     * Make an array of weights, the indices represent the distance from current point
     * @param {number} windowSize Size of the "window", tha is the number of samples.
     * @returns {number[]} the weights, the indices reppresenting the distance from current point
     */
    function getWeights(windowSize) {

        let weights = [Math.floor((windowSize + 2) / 2)]

        for (let i = 1; i <= weights[0] - 1; ++i) {
            weights.push(weights[i - 1] - 1);
        }

        return weights;

    }

    console.log('--------- testing getWeights ---------');
    for (let i = 1; i < 6; ++i)
        console.log(i, getWeights(i));

    const MAX_STOP = rawValues.length - 1;

    let movingAvgData = [];

    let sum = 0;

    let AVG_START = 0;
    let AVG_STOP = Math.floor((windowSize - 1) / 2);

    let weights = getWeights(windowSize);

    function weighted_avg(start, stop, position) {

        let weights_sum = 0;
        let w_j;
        sum = 0;

        for (let j = start; j < stop + 1; ++j) {
            w_j = weights[Math.abs(position - j)];
            sum += rawValues[j] * w_j;
            weights_sum += w_j;
        }

        return sum / weights_sum;

    }

    function increment(i) {

        movingAvgData.push(weighted_avg(AVG_START, AVG_STOP, i));

        if (AVG_STOP + 1 - AVG_START >= windowSize || AVG_STOP == MAX_STOP) {
            ++AVG_START;
        }

        if (AVG_STOP < MAX_STOP) {
            ++AVG_STOP;
        }
    }

    for (let i = 0; i < rawValues.length; ++i) {
        increment(i);
    }

    return movingAvgData;

}

export { computeMovingAvg, computeWeightedMovingAvg };
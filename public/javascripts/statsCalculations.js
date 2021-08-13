function computeMovingAvg(rawValues, windowSize) {

    let movingAvgData = [];

    let AVG_START = Math.floor(-(windowSize - 1) / 2);
    let AVG_STOP = Math.floor((windowSize - 1) / 2);

    for (let i = 0; i < -AVG_START; ++i) {
        movingAvgData.push(null);
    }

    for (let i = -AVG_START; i < rawValues.length - AVG_STOP; ++i) {

        let sum = 0;
        for (let j = i + AVG_START; j < i + AVG_STOP + 1; ++j) {

            sum += rawValues[j];
        }
        movingAvgData.push(sum / (1 + AVG_STOP - AVG_START));
    }

    return movingAvgData;

}

export { computeMovingAvg };
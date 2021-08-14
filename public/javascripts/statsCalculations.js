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

export { computeMovingAvg };
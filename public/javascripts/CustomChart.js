'use strict';

import { computeMovingAvg } from '/javascripts/statsCalculations.js';

class CustomChart {

    constructor(canvasId) {

        this.movingAvgWindowSize = 1;

        this.barChartConfig = {
            type: 'bar',
            label: 'My First dataset',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132, 0.9)',
            data: null,
            borderWidth: 1,
        };

        this.movingAvgConfig = {
            type: 'line',
            label: '',
            backgroundColor: 'rgb(0, 0, 0)',
            borderColor: 'rgb(0, 0, 0)',
            data: null,
        };

        this.data = {
            labels: null,
            datasets: [this.movingAvgConfig, this.barChartConfig]
        };

        let config = {
            data: this.data,
            options: {}
        };

        let canvas = $(canvasId);

        this._chart = new Chart(
            canvas,
            config
        );

    }

    setMovingAvgWindowSize(value) {

        this.movingAvgWindowSize = value;

        this.movingAvgConfig.data = computeMovingAvg(this.barChartConfig.data, value);
        this.movingAvgConfig.label = 'Moving Average, k = ' + value;

        this._chart.update();
    }

    setData(data, xTicksLabels, movingAvgWindowSize) {

        movingAvgWindowSize = movingAvgWindowSize || this.movingAvgWindowSize;

        this.barChartConfig.data = data;
        this.data.labels = xTicksLabels;
        this.setMovingAvgWindowSize(movingAvgWindowSize);
    }
}

export default CustomChart;
'use strict';

import { computeMovingAvg } from '/javascripts/statsCalculations.js';

class CustomChart {

    constructor(canvasId) {

        this.movingAvgWindowSize = 1;

        let barChartColor = '#4589ff';
        let movingAverageChartColor = '#bae6ff';

        this.barChartConfig = {
            type: 'bar',
            label: 'My First dataset',
            backgroundColor: barChartColor,
            borderColor: barChartColor,
            data: null,
            borderWidth: 1,
        };

        this.movingAvgConfig = {
            type: 'line',
            label: '',
            backgroundColor: movingAverageChartColor,
            borderColor: movingAverageChartColor,
            data: null,
        };

        this.data = {
            labels: null,
            datasets: [this.movingAvgConfig, this.barChartConfig]
        };

        const gridColor = 'rgb(94, 102, 109)';

        let config = {
            data: this.data,
            options: {
                scales: {
                    x: {
                        grid: {
                            display: false,
                            borderColor: gridColor,
                            color: gridColor,
                            tickColor: gridColor
                        }
                    },
                    y: {
                        grid: {
                            display: false,
                            borderColor: gridColor,
                            color: gridColor,
                            tickColor: gridColor
                        }
                    }
                }
            }
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
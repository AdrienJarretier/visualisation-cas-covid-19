'use strict';

import { computeWeightedMovingAvg } from '/javascripts/statsCalculations.js';

class CustomChart {

    constructor(canvasId) {

        this.movingAvgWindowSize = 1;

        this.zoom = {
            days: null
        };

        let barChartColor = '#4589ff';
        let movingAverageChartColor = '#bae6ff';

        this.barChartConfig = {
            type: 'bar',
            label: 'Nombre de cas',
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

        this.config = {
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
                , maintainAspectRatio: false
            }
        };

        let canvas = $(canvasId);

        this._chart = new Chart(
            canvas,
            this.config
        );

    }

    _update() {

        if (this.zoom.days)
            this.config.options.scales.x.min = this.data.labels.length - this.zoom.days;
        else
            this.config.options.scales.x.min = null;

        this._chart.update();
    }

    setMovingAvgWindowSize(value, options) {
        value = parseInt(value);

        options = options || {};
        options = {
            keepYAxis: options.keepYAxis || false
        };

        this.movingAvgWindowSize = value;

        this.movingAvgConfig.data = computeWeightedMovingAvg(this.barChartConfig.data, value);
        this.movingAvgConfig.label = 'Moyenne glissante sur ' + value + ' jours';

        this._update();
    }

    setData(data, xTicksLabels, movingAvgWindowSize, options) {

        movingAvgWindowSize = movingAvgWindowSize || this.movingAvgWindowSize;

        options = options || {};
        options = {
            keepYAxis: options.keepYAxis || false
        };

        this.barChartConfig.data = data;
        this.data.labels = xTicksLabels;
        this.setMovingAvgWindowSize(movingAvgWindowSize, options);
    }

    setScaleLog(logBool) {
        this.config.options.scales.y.type = (logBool ? 'logarithmic' : 'linear');
        this._update();
    }

    /**
     * Zoom on the n last days
     * @param {number} n Nomber of days to zoom in 
     */
    setZoomLastDays(n) {

        this.zoom.days = n;
        this._update();

    }

    get scales() {
        return this._chart.scales;
    }

    setMaxY(value) {
        this.config.options.scales.y.max = value;
        this._update();
    }
}

export default CustomChart;
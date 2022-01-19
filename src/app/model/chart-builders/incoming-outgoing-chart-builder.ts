import { Options } from "highcharts";
import { ChartBuilderInterface } from "../interfaces/chart-builder.interface";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";

import * as moment from 'moment';
import * as Highcharts from "highcharts";
import { AppUtils } from "../utils/app-utils";

export class IncomingOutgoingChartBuilder implements ChartBuilderInterface {

    static getChartOptions(moviments: MovimentBSInterface[]): Options {

       return  {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            credits: { enabled: false },
            legend: { enabled: false },
            title: { text: '' },
            tooltip: {
                // pointFormat: '{series.name}<b>{point.value} € ({point.percentage:.1f}%)</b>'
                formatter: function () {
                    return '<b>' + this.key + '</b><br>' + 
                        AppUtils.numberFormat(this.point.value, 2) + ' € (' +
                        AppUtils.numberFormat(this.y, 2) + ' %)';
                }
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    colors: ['#28a745','#dc0028'],
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                        filter: {
                            property: 'percentage',
                            operator: '>',
                            value: 4
                        }
                    }
                }
            },
            series: [{
                name: '',
                type: 'pie',
                data: this.getSerieData(moviments)
            }]
        }
    }


    static getSerieData(moviments: MovimentBSInterface[]): Highcharts.PointOptionsObject[] {
        
        const pointOptions: Highcharts.PointOptionsObject[] = [
            {name: 'Ingressos', y: 0, value: 0},
            {name: 'Despeses', y: 0, value: 0}
        ];

        let totalAmount = 0;
        moviments.forEach((m) => {
            totalAmount += Math.abs(m.importOperacio);
            pointOptions[(m.importOperacio > 0)? 0 : 1].y += Math.abs(m.importOperacio);
            pointOptions[(m.importOperacio > 0)? 0 : 1].value += Math.abs(m.importOperacio);
        });

        pointOptions.forEach((pointOption) => {
            const percent = (pointOption.y * 100) / totalAmount;
            pointOption.y = percent;
        });
        return pointOptions;
    }

}
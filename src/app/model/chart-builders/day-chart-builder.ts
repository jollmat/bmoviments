import * as Highcharts from "highcharts";
import { Options } from "highcharts";
import { AmountSymbolEnum } from "../enums/amount-symbol.enum";
import { ChartBuilderInterface } from "../interfaces/chart-builder.interface";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";
import { AppUtils } from "../utils/app-utils";

export class DayChartBuilder implements ChartBuilderInterface {

    static getChartOptions(moviments: MovimentBSInterface[], symbol: AmountSymbolEnum): Options {

        var pieColors = (function () {
            var colors = [],
                base = (symbol === AmountSymbolEnum.NEGATIVE)? '#DC0028' : '#28a745',
                i;
        
            for (i = 0; i < 10; i += 1) {
                colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
            }
            return colors;
        }());

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
                    colors: pieColors,
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
                data: this.getSerieData(moviments, symbol)
            }]
        }
    }

    static getSerieData(moviments: MovimentBSInterface[], symbol: AmountSymbolEnum): Highcharts.PointOptionsObject[] {
        
        const pointOptions: Highcharts.PointOptionsObject[] = [];
        let dayAmount = 0;

        moviments.forEach((m) => {
            if ((symbol === AmountSymbolEnum.NEGATIVE && m.importOperacio < 0) || (symbol === AmountSymbolEnum.POSITIVE && m.importOperacio > 0)) {
                dayAmount += Math.abs(m.importOperacio);
                const conceptIndex = pointOptions.findIndex((p) => { return p.name === m.concepte; });
                if (conceptIndex === -1) {
                    pointOptions.push({
                        name: m.concepte,
                        y: Math.abs(m.importOperacio),
                        value: Math.abs(m.importOperacio)
                    });
                } else {
                    pointOptions[conceptIndex].y += Math.abs(m.importOperacio);
                    pointOptions[conceptIndex].value += Math.abs(m.importOperacio);
                }
            }
        });

       pointOptions.forEach((pointOption) => {
            const percent = (pointOption.y * 100) / dayAmount;
            pointOption.y = percent;
        });
        return pointOptions;
    }

}
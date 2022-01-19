import { Options } from "highcharts";
import { ChartBuilderInterface } from "../interfaces/chart-builder.interface";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";

import * as moment from 'moment';
import * as Highcharts from "highcharts";
import { AppUtils } from "../utils/app-utils";

export enum INTERVAL_CHART_EVOL_TYPE_ENUM {
    DAILY = 'DAILY',
    MONTHLY = 'MONTHLY'
}

export class DateIntervalChartBuilder implements ChartBuilderInterface {

    static getChartOptions(moviments: MovimentBSInterface[], evolutionType: INTERVAL_CHART_EVOL_TYPE_ENUM): Highcharts.Options {

       const serieAvgData: {amount: number, color: string} = this.getSerieAverage(moviments);

       return  {
            chart: {
                type: "column",
            },
            credits: { enabled: false },
            legend: { enabled: false },
            title: { text: '' },
            plotOptions: {
                column: {
                    pointWidth: 3
                }
            },
            tooltip: {
                formatter: function () {
                    const dateFormat = (evolutionType === INTERVAL_CHART_EVOL_TYPE_ENUM.DAILY) ? 'DD MMM YYYY' : 'MMM YYYY';
                    return '<b>' + moment(this.x - (1000*60*60*24)).format(dateFormat) + '</b><br>' + 
                        AppUtils.numberFormat(this.y) + ' €';
                }
            },
            xAxis: {
                labels: {
                    formatter: function() {
                        const dateFormat = (evolutionType === INTERVAL_CHART_EVOL_TYPE_ENUM.DAILY) ? '%e/%b/%Y' : '%b/%Y';
                        return Highcharts.dateFormat(dateFormat, this.value);
                    }
                },
                type: "datetime"
            },
            yAxis: {
                title: { text: '€' },
                plotLines: [
                    {
                        value: 0,
                        color: '#888888',
                        dashStyle: 'Solid',
                        width: 2
                    },
                    {
                        value: serieAvgData.amount,
                        color: serieAvgData.color,
                        dashStyle: 'ShortDot',
                        width: 1,
                        label: { text: 'Promig' }
                    }
                ]
            },
            series: [
                {
                    name: 'Import',
                    type: 'column',
                    data: this.getSerieData(moviments, evolutionType)
                }
            ]
        }
    }

    static getSerieAverage(moviments: MovimentBSInterface[]): {amount: number, color: string} {
        let accumulate = 0;
        let allNegative: boolean = true;

        moviments.forEach((m) => {
            if (allNegative && m.importOperacio > 0) {
                allNegative = false;
            }
            accumulate += m.importOperacio;
        });
        if (allNegative) {
            return {
                amount: Math.abs(Number.parseFloat((accumulate / moviments.length).toFixed(2))),
                color: '#DC0028'
            };
        }
        return {
            amount: Number.parseFloat((accumulate / moviments.length).toFixed(2)),
            color: accumulate > 0 ? '#28a745' : '#dc0028'
        };
    }

    static getSerieData(moviments: MovimentBSInterface[], evolutionType: INTERVAL_CHART_EVOL_TYPE_ENUM): Highcharts.PointOptionsObject[] {

        const pointOptions: Highcharts.PointOptionsObject[] = [];

        let dates: any[] = [];
        const amounts: number[] = [];

        let allNegative: boolean = true;

        moviments.forEach((m) => {
            const dataOperacio = (evolutionType === INTERVAL_CHART_EVOL_TYPE_ENUM.DAILY) ? m.dataOperacio : m.dataOperacio.substring(3);
            const dateIdx = dates.findIndex((d) => { 
                return d === dataOperacio; 
            });
            if (allNegative && m.importOperacio > 0) {
                allNegative = false;
            }
            if (dateIdx > -1) {
                amounts[dateIdx] += m.importOperacio;
            } else {
                dates.push(dataOperacio);
                amounts.push(m.importOperacio);                
            }
        });

        dates = dates.map((d) => {
            const datePattern = (evolutionType === INTERVAL_CHART_EVOL_TYPE_ENUM.DAILY) ? 'DD/MM/YYYY' : 'MM/YYYY';
            return moment(d, datePattern).valueOf() + 1000*60*60*24
        });

        dates.forEach((d, idx) => {
            pointOptions.push({
                x: d,
                y: allNegative ? Math.abs(amounts[idx]) : amounts[idx],
                color: amounts[idx] > 0 ? '#28a745' : '#dc0028'
            });          
        });
        return pointOptions;
    }

}
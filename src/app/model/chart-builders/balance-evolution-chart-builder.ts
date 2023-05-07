import { Options, SeriesOptionsType } from "highcharts";
import { ChartBuilderInterface } from "../interfaces/chart-builder.interface";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";

import * as moment from 'moment';

export class BalanceEvolutionChartBuilder implements ChartBuilderInterface {
    static getChartOptions(moviments: MovimentBSInterface[]): Options {

        const data: {
            series: {
                name: string, 
                type: string, 
                data: number[][]
            }[], 
            categories: number[]
        } = BalanceEvolutionChartBuilder.getProcessedData(moviments);

        console.log(data);

        return  {
            chart: {
                type: 'area'
            },
            title: { text: '' },
            subtitle: { text: '' },
            credits: {enabled: false},
            yAxis: {},
            xAxis: { type: 'datetime' },
            tooltip: {
                shared: true,
                xDateFormat: '%d/%m/%Y'//'%Y-%m-%d'
                // headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>'
            },
            plotOptions: {
                series: {
                    
                },
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: (data.series) as Array<SeriesOptionsType>
        }
    }

    static getProcessedData(moviments: MovimentBSInterface[]): {series: {name: string, type: string, data: number[][]}[], categories: number[]} {
        let series: {name: string, type: string, data: number[][]}[] = [];
        let categories: number[] = [];

        let bankEntities: string[] = [];
        let dates: string[] = [];
        
        moviments.reverse().forEach((_moviment) => {
            if (!bankEntities.includes(_moviment.bankEntitySymbol)) {
                bankEntities.push(_moviment.bankEntitySymbol);
            }
            if (!dates.includes(_moviment.dataOperacio)) {
                dates.push(_moviment.dataOperacio);
            }
        });

        // Set series
        series = bankEntities.map((_bank) => {
            return {
                name: _bank,
                type: 'area',
                data: []
            }
        });

        // For each serie, recover balance by date
        series.forEach((_serie) => {
            dates.forEach((_date) => {
                const dateBalanceIndex: number = moviments.findIndex((_moviment) => {
                    return _moviment.dataOperacio===_date && _moviment.bankEntitySymbol===_serie.name;
                });
                if (dateBalanceIndex>=0) {
                    _serie.data.push([null, moviments[dateBalanceIndex].saldo]);
                } else {
                    _serie.data.push(null);
                }
            });
        });

        // Discard series with no balance
        series = series.filter((_serie) => {
            return _serie.data.findIndex((_balance) => _balance!=null && _balance[1]!=null)>=0;
        });

        categories = dates.map((_date) => {
            return moment(_date, 'DD/MM/YYYY').valueOf();
        });

        series.forEach((_serie) => {
            console.log(_serie);
            _serie.data = _serie.data.map((_saldo, idx) => {
                return [categories[idx], (_saldo && _saldo.length>1) ? _saldo[1] : null]
            });
        });

        return {series,categories}
    }
}
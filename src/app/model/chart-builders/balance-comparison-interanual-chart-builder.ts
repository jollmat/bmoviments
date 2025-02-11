import { Options, SeriesOptionsType } from "highcharts";
import { ChartBuilderInterface } from "../interfaces/chart-builder.interface";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";

import * as moment from 'moment';

export class BalanceComparisonInteranualChartBuilder implements ChartBuilderInterface {
    static getChartOptions(moviments: MovimentBSInterface[]): Options {

        const data: {
            series: {
                name: string, 
                type: string, 
                data: number[][]
            }[]
        } = BalanceComparisonInteranualChartBuilder.getProcessedData(moviments);

        return {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Line Chart with Two Series'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                title: {
                    text: 'Values'
                }
            },
            series: this.getProcessedData(moviments).series as SeriesOptionsType[]
        };

    }

    static getProcessedData(moviments: MovimentBSInterface[]): {series: {name: string, type: string, data: number[][]}[]} {
        let series: {name: string, type: string, data: number[][]}[] = [];

        moviments.sort((a,b) => {
            return moment(a.dataOperacio, 'DD/MM/YYYY').toDate().getTime()>moment(b.dataOperacio, 'DD/MM/YYYY').toDate().getTime()?1:-1
        });

        const years = [...new Set(moviments.map(item => {
            return moment(item.dataOperacio, 'DD/MM/YYYY').get('year');
        }))];

        years.forEach((_year) => {
            const datesSaldos: {date: Date, saldo: number}[] = this.getDatesSaldos(moviments, _year);
            const serie: {name: string, type: string, data: number[][]} = {
                type: 'line',
                name: String(_year),
                data: datesSaldos.map((dataSaldo) => {
                    return [moment(dataSaldo.date).utc() as any, dataSaldo.saldo]
                })
            };
            series.push(serie);
        });
        return {series}
    }

    static getDatesSaldos(moviments: MovimentBSInterface[], year: number): {date: Date, saldo: number}[] {
        let dates: string[] = [];
        moviments.filter((_moviment) => {
            return moment(_moviment.dataOperacio, 'DD/MM/YYYY').get('year')===year;
        }).forEach((_moviment) => {
            dates.push(_moviment.dataOperacio);
            dates = [...new Set(dates)];
        });
        const datesSaldos: {date: Date, saldo: number}[] = [];
        dates.forEach((_data) => {
            const movimentsData = moviments.filter((_moviment) => {
                return _moviment.dataOperacio===_data;
            });
            datesSaldos.push({
                date: moment(_data, 'DD/MM/YYYY').toDate(),
                saldo: movimentsData[movimentsData.length-1].saldo
            });
        });
        return datesSaldos;
    }
}
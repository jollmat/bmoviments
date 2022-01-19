import { SeriesOptionsType } from "highcharts";
import { MovimentBSEntity } from "../entities/moviment-BS-entity";
import { ChartBuilderInterface } from "../interfaces/chart-builder.interface";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";
import { AppUtils } from "../utils/app-utils";

export class InputOutputStackedChartBuilder implements ChartBuilderInterface {
    
    static getChartOptions(moviments: MovimentBSInterface[]): Highcharts.Options {

        const groupedData = MovimentBSEntity.getGroupedPointOptions(moviments);

        let ingressosAll: Highcharts.PointOptionsObject[] = AppUtils.sortArrayBy(groupedData.input, 'value', false);
        let despesesAll: Highcharts.PointOptionsObject[] = AppUtils.sortArrayBy(groupedData.output, 'value', false);

        const inputColors = ['rgba(42, 175, 47, 1)', 'rgba(42, 175, 47, .6)'];
        const outputColors = ['rgba(220, 53, 69, 1)', 'rgba(220, 53, 69, .6)'];

        let inputSeries: SeriesOptionsType[] = [];
        let outputSeries: SeriesOptionsType[] = [];
        
        ingressosAll.forEach((ingres, idx) => {
            inputSeries.push( {
                name: ingres.name.toString(),
                type: 'column',
                color: inputColors[idx%2===0?0:1],
                data: [{y: ingres.value, name: ingres.name},{ y: null}]
            });
        });

        despesesAll.forEach((despesa, idx) => {
            outputSeries.push( {
                name: despesa.name.toString(),
                type: 'column',
                color: outputColors[idx%2===0?0:1],
                data: [{ y: null}, {y: despesa.value, name: despesa.name}]
            });
        });

        const options: Highcharts.Options = {
            chart: {  type: 'column' },
            title: { text: '' },
            xAxis: { categories: ['Ingressos', 'Despeses'] },
            yAxis: {
                min: 0,
                title: { text: '' },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold'
                    },
                    formatter: function(){
                        return AppUtils.numberFormat(this.total, 2) + ' € ';
                    }
                }
            },
            tooltip: {
                shared: false,
                useHTML: true,
                formatter: function () {
                    return '<b>' + this.x + '</b><br>' +
                        this.point.name + '<br>' + 
                        AppUtils.numberFormat(this.y, 2) + ' € ' + 
                        ' (' + AppUtils.numberFormat(this.percentage, 2) + '%)';
                }
            },
            plotOptions: {
                series: { lineWidth: 0 },
                column: { 
                    stacking: 'normal',
                    pointPadding: 0,
                    borderWidth: 0 
                }
            },
            legend: { enabled: false },
            series: [...inputSeries, ...outputSeries]
        };
        return options;
    }
}
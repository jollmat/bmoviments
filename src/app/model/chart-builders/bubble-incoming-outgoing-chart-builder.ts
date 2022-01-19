import { ChartBuilderInterface } from "../interfaces/chart-builder.interface";
import { MovimentBSInterface } from "../interfaces/moviment-BS-interface";

import * as Highcharts from "highcharts";
import { AppUtils } from "../utils/app-utils";
import { MovimentBSEntity } from "../entities/moviment-BS-entity";

export class BubbleIncomingOutgoingChartBuilder implements ChartBuilderInterface {

    static MAX_BUBBLES: number = 1000;

    static getChartOptions(moviments: MovimentBSInterface[]): Highcharts.Options {
        const options: Highcharts.Options = {
            chart: {
                type: 'packedbubble'
            },
            title: {
                text: ''
            },
            tooltip: {
                useHTML: true,
                formatter: function () {
                    if (!this.y) {
                        return '<b>' + this.point.series.name + '</b>';
                    }
                    return '<b>' + this.point.name + '</b><br>' + 
                        AppUtils.numberFormat(this.y) + ' €';
                }
            },
            plotOptions: {
                packedbubble: {
                    minSize: '10%',
                    maxSize: '100%',
                    layoutAlgorithm: {
                        splitSeries: 'false',
                        gravitationalConstant: 0.02
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        filter: {
                            property: 'y',
                            operator: '>',
                            value: 600
                        },
                        style: {
                            color: 'black',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            series: this.getSerieData(moviments),
            credits: { enabled: false }
        };
        return options;
    }


    static getSerieData(moviments: MovimentBSInterface[]): Highcharts.SeriesOptionsType[] {

        const groupedData = MovimentBSEntity.getGroupedPointOptions(moviments);

        let ingressosAll: Highcharts.PointOptionsObject[] = groupedData.input;
        let despesesAll: Highcharts.PointOptionsObject[] = groupedData.output;

        ingressosAll = AppUtils.sortArrayBy(ingressosAll, 'value', false);
        despesesAll = AppUtils.sortArrayBy(despesesAll, 'value', false);

        if (ingressosAll.length > this.MAX_BUBBLES) {
            ingressosAll = ingressosAll.slice(0, this.MAX_BUBBLES);
        }

        if (despesesAll.length > this.MAX_BUBBLES) {
            despesesAll = despesesAll.slice(0, this.MAX_BUBBLES);
        }

        const seriesOptions: Highcharts.SeriesOptionsType[] = [];

        if (ingressosAll.length > 0) {
            seriesOptions.push({
                name: 'Ingressos',
                type: 'packedbubble',
                color: '#28a745',
                data: ingressosAll
            });
        }

        if (despesesAll.length > 0) {
            seriesOptions.push({
                name: 'Despeses',
                type: 'packedbubble',
                color: '#dc0028',
                data: despesesAll
            });
        }

        return seriesOptions;
    }

}
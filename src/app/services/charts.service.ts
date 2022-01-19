import { Injectable } from '@angular/core';
import { MovimentsDTOFilter, ChartOptionsDTO } from '../model/model-data';
import { Chart } from 'angular-highcharts';
import { of, Observable } from 'rxjs';
import { GroupTypesEnum } from '../model/enums/group-types.enum';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
    
    getChart (chartOptions: ChartOptionsDTO): Observable<Chart> {
        let categories = [];
        let serieData = [];
        const colors = [];

        if(chartOptions.groupBy === GroupTypesEnum.NONE || 
            chartOptions.groupBy === GroupTypesEnum.DAY ||
            chartOptions.groupBy === GroupTypesEnum.MONTH) {
            
            const categoriesGrouped = [];
            const seriesDataGrouped = [];
            chartOptions.moviments.forEach((mov) => {
                const catIdx = categoriesGrouped.indexOf((chartOptions.groupBy === GroupTypesEnum.MONTH) ? mov.dataOperacio.substr(3) : mov.dataOperacio);

                if(catIdx >= 0) {
                    seriesDataGrouped[catIdx] += mov.importOperacio;
                } else {
                    categoriesGrouped.push((chartOptions.groupBy === GroupTypesEnum.MONTH) ? mov.dataOperacio.substr(3) : mov.dataOperacio);
                    seriesDataGrouped.push(mov.importOperacio);
                }
            });
            categories = categoriesGrouped;
            serieData = seriesDataGrouped;
        }

        categories.reverse();
        serieData.reverse();
        colors.reverse();

        const res = new Chart({
            chart: {
                type: 'column'
            },
            title: {
                text: this.getChartTitle(chartOptions)
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                column: {
                    negativeColor: '#dc0028'
                }
            },
            xAxis: {
                categories: categories
            },
            series: [
                {
                type: "column",
                name: chartOptions.filter.concept ? chartOptions.filter.concept : 'Balanç',
                data: serieData,
                colors: colors
                }
            ]
        });

        console.log(res);

        return of(res);

    }

    getChartTitle(chartOptions: ChartOptionsDTO): string {
        let res = '';

        if(!this.isFilterEmpty(chartOptions.filter)){
            if(chartOptions.filter.concept && chartOptions.filter.concept.length > 0){
                res += chartOptions.filter.concept;
            }
            if(chartOptions.filter.date && chartOptions.filter.date.length > 0){
                if (res.length > 0) { res += ', '; }
                res += chartOptions.filter.date;
            }
            if(chartOptions.filter.tipusImport && chartOptions.filter.tipusImport.length > 0){
                if (res.length > 0) { res += ', '; }
                res += chartOptions.filter.tipusImport;
            }
        }

        res += ((res.length > 0 ? ' / ' : '') + (chartOptions.groupBy !== GroupTypesEnum.NONE ? 'By ' + chartOptions.groupBy : ''));

        return res;
    }

    isFilterEmpty (filter: MovimentsDTOFilter) {
        return filter.concept.length === 0 &&
        filter.date.length === 0 &&
        filter.dateFrom == null &&
        filter.dateTo == null &&
        filter.tipusImport.length === 0 &&
        filter.importMax == null &&
        filter.importMin == null;
      }

}
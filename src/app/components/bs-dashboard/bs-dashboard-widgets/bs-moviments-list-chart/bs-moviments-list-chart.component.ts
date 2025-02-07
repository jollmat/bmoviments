import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FilterValueTypeEnum } from 'src/app/model/enums/filter-value-type.enum';
import { MovimentBSInterface } from 'src/app/model/interfaces/moviment-BS-interface';

import { Chart } from 'angular-highcharts';
import { DayChartBuilder } from 'src/app/model/chart-builders/day-chart-builder';
import { AmountSymbolEnum } from 'src/app/model/enums/amount-symbol.enum';
import { DateIntervalChartBuilder, INTERVAL_CHART_EVOL_TYPE_ENUM } from 'src/app/model/chart-builders/date-interval-chart-builder';
import { IncomingOutgoingChartBuilder } from 'src/app/model/chart-builders/incoming-outgoing-chart-builder';
import { BubbleIncomingOutgoingChartBuilder } from 'src/app/model/chart-builders/bubble-incoming-outgoing-chart-builder';
import { InputOutputStackedChartBuilder } from 'src/app/model/chart-builders/input-output-stacked-chart-builder';
import { CookieService } from 'ngx-cookie';
import { BalanceEvolutionChartBuilder } from 'src/app/model/chart-builders/balance-evolution-chart-builder';

@Component({
  selector: 'app-bs-moviments-list-chart',
  templateUrl: './bs-moviments-list-chart.component.html',
  styleUrls: ['./bs-moviments-list-chart.component.scss']
})
export class BsMovimentsListChartComponent implements OnChanges {

  @Input()
  moviments: MovimentBSInterface[] = [];

  filterValueType: FilterValueTypeEnum = FilterValueTypeEnum.NONE;

  charts: {text: string, chart: Chart}[] = [];

  selectedChartIndex: number = 0;

  constructor(private cookiesService: CookieService) { }

  checkFilterValueChartType() {
    if (this.moviments.length > 0) {  
      const days: string[] = [];
      for (let i=0; i < this.moviments.length; i++) {
        if (days.indexOf(this.moviments[i].dataOperacio) === -1) {
          days.push(this.moviments[i].dataOperacio);
        }
        if (days.length > 1) {
          this.filterValueType = FilterValueTypeEnum.PERIOD;
          break;
        }
      }
      if (days.length === 1) {
        this.filterValueType = FilterValueTypeEnum.ONE_DAY;
      }
    } else {
      this.filterValueType = FilterValueTypeEnum.NONE;
    }
  }

  renderCharts() {
    this.charts.push({text: 'Evolució ingresos/despeses (diari)', chart: new Chart(DateIntervalChartBuilder.getChartOptions(this.moviments, INTERVAL_CHART_EVOL_TYPE_ENUM.DAILY))});
    this.charts.push({text: 'Evolució ingresos/despeses (mensual)', chart: new Chart(DateIntervalChartBuilder.getChartOptions(this.moviments, INTERVAL_CHART_EVOL_TYPE_ENUM.MONTHLY))});
    this.charts.push({text: 'Dades agrupades i proporció (bombolles)', chart: new Chart(BubbleIncomingOutgoingChartBuilder.getChartOptions(this.moviments))}); 
    this.charts.push({text: 'Dades agrupades i proporció (apilat)', chart: new Chart(InputOutputStackedChartBuilder.getChartOptions(this.moviments))});
    this.charts.push({text: 'Ingressos vs despeses (pastís)', chart: new Chart(IncomingOutgoingChartBuilder.getChartOptions(this.moviments))});
    this.charts.push({text: 'Evolució del saldo (àrea apilat)', chart: new Chart(BalanceEvolutionChartBuilder.getChartOptions(this.moviments))});    
  
    if (this.filterValueType === FilterValueTypeEnum.ONE_DAY) {
      this.charts.push({text: 'Ingressos dia', chart: new Chart(DayChartBuilder.getChartOptions(this.moviments, AmountSymbolEnum.POSITIVE))});
      this.charts.push({text: 'Despeses dia', chart: new Chart(DayChartBuilder.getChartOptions(this.moviments, AmountSymbolEnum.NEGATIVE))});
    }
  }

  selectChartIndex(idx: number): void {
    this.selectedChartIndex = idx;
    this.cookiesService.put('selectedChartIndex', this.selectedChartIndex.toString());
  }
  
  ngOnChanges(changes: SimpleChanges): void {

    this.selectChartIndex((!this.cookiesService.get('selectedChartIndex')) ? 0 : parseInt(this.cookiesService.get('selectedChartIndex')));

    if (changes.moviments) {
     this.charts = [];
     this.checkFilterValueChartType();
     this.renderCharts();     
    }
  }

}

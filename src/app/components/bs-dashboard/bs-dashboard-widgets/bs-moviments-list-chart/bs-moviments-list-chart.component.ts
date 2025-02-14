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
import { BalanceComparisonInteranualChartBuilder } from 'src/app/model/chart-builders/balance-comparison-interanual-chart-builder';

@Component({
  selector: 'app-bs-moviments-list-chart',
  templateUrl: './bs-moviments-list-chart.component.html',
  styleUrls: ['./bs-moviments-list-chart.component.scss']
})
export class BsMovimentsListChartComponent implements OnChanges {

  @Input()
  moviments: MovimentBSInterface[] = [];
  @Input()
  anys: number[] = [];
  @Input()
  mesos: string[] = [];
  @Input()
  dies: string[] = [];
  @Input()
  ingressos: MovimentBSInterface[] = [];
  @Input()
  despeses: MovimentBSInterface[] = [];

  filterValueType: FilterValueTypeEnum = FilterValueTypeEnum.NONE;

  charts: {text: string, chart: Chart, storeable: boolean}[] = [];

  selectedChartIndex: number = 0;

  constructor(private cookiesService: CookieService) { }

  renderCharts() {
    this.charts = [];
    if (this.dies.length>0) {
      this.charts.push({text: 'Evolució ingresos/despeses (diari)', chart: new Chart(DateIntervalChartBuilder.getChartOptions(this.moviments, INTERVAL_CHART_EVOL_TYPE_ENUM.DAILY)), storeable: true});
      this.charts.push({text: 'Dades agrupades i proporció (bombolles)', chart: new Chart(BubbleIncomingOutgoingChartBuilder.getChartOptions(this.moviments)), storeable: true}); 
      this.charts.push({text: 'Dades agrupades i proporció (apilat)', chart: new Chart(InputOutputStackedChartBuilder.getChartOptions(this.moviments)), storeable: true});
      this.charts.push({text: 'Ingressos vs despeses (pastís)', chart: new Chart(IncomingOutgoingChartBuilder.getChartOptions(this.moviments)), storeable: true});
      this.charts.push({text: 'Evolució del saldo (àrea apilat)', chart: new Chart(BalanceEvolutionChartBuilder.getChartOptions(this.moviments)), storeable: true});  
      
      if (this.dies.length===1) {
        if (this.ingressos.length>0) {
          this.charts.push({text: 'Ingressos dia', chart: new Chart(DayChartBuilder.getChartOptions(this.moviments, AmountSymbolEnum.POSITIVE)), storeable: true});
        }
        if (this.despeses.length>0) {
          this.charts.push({text: 'Despeses dia', chart: new Chart(DayChartBuilder.getChartOptions(this.moviments, AmountSymbolEnum.NEGATIVE)), storeable: true});
        }
      }
      if (this.anys.length>1) {
        this.charts.push({text: 'Comparativa de saldo interanual', chart: new Chart(BalanceComparisonInteranualChartBuilder.getChartOptions(this.moviments)), storeable: false}); 
      }
      if (this.mesos.length>1) {
        this.charts.push({text: 'Evolució ingresos/despeses (mensual)', chart: new Chart(DateIntervalChartBuilder.getChartOptions(this.moviments, INTERVAL_CHART_EVOL_TYPE_ENUM.MONTHLY)), storeable: true});
      }

      this.charts.sort((a,b) => {
        return a.text>b.text?1:-1;
      });
    }
   
  }

  selectChartIndex(idx: number, storeable: boolean): void {
    this.selectedChartIndex = idx;
    if (storeable) {
      this.cookiesService.put('selectedChartIndex', this.selectedChartIndex.toString());
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {

    this.selectChartIndex((!this.cookiesService.get('selectedChartIndex')) ? 0 : parseInt(this.cookiesService.get('selectedChartIndex')), true);

    if (changes.moviments) {
     this.renderCharts();     
    }
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';

import { registerLocaleData } from '@angular/common';

import localeEs from '@angular/common/locales/es';
import { PercentbarComponent } from './components/common/percentbar/percentbar.component';
import { BSFileLoaderComponent } from './components/common/bs-file-loader/bs-file-loader.component';
import { BSDashboardLayoutComponent } from './components/bs-dashboard/bs-dashboard-layout/bs-dashboard-layout.component';
import { BSDashboardHeaderComponent } from './components/bs-dashboard/bs-dashboard-header/bs-dashboard-header.component';
import { BSDashboardFooterComponent } from './components/bs-dashboard/bs-dashboard-footer/bs-dashboard-footer.component';
import { BSMovimentsListComponent } from './components/bs-dashboard/bs-dashboard-widgets/bs-moviments-list/bs-moviments-list.component';
import { BsLastMovimentsComponent } from './components/bs-dashboard/bs-dashboard-widgets/bs-last-moviments/bs-last-moviments.component';
import { BsTopIncomingComponent } from './components/bs-dashboard/bs-dashboard-widgets/bs-top-incoming/bs-top-incoming.component';
import { BsTopOutgoingComponent } from './components/bs-dashboard/bs-dashboard-widgets/bs-top-outgoing/bs-top-outgoing.component';
import { BsSearchMovimentsComponent } from './components/bs-dashboard/bs-dashboard-widgets/bs-search-moviments/bs-search-moviments.component';

import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { BsMovimentsListChartComponent } from './components/bs-dashboard/bs-dashboard-widgets/bs-moviments-list-chart/bs-moviments-list-chart.component';
import { StorageCapacityMonitorComponent } from './components/common/storage-capacity-monitor/storage-capacity-monitor.component';
import { BsConceptsLayoutComponent } from './components/bs-concepts/bs-concepts-layout/bs-concepts-layout.component';
import { BsConceptMappersListComponent } from './components/bs-concepts/components/bs-concept-mappers-list/bs-concept-mappers-list.component';
import { FormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    PercentbarComponent,
    BSFileLoaderComponent,
    BSDashboardLayoutComponent,
    BSDashboardHeaderComponent,
    BSDashboardFooterComponent,
    BSMovimentsListComponent,
    BsLastMovimentsComponent,
    BsTopIncomingComponent,
    BsTopOutgoingComponent,
    BsSearchMovimentsComponent,
    BsMovimentsListChartComponent,
    StorageCapacityMonitorComponent,
    BsConceptsLayoutComponent,
    BsConceptMappersListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ChartModule,
    SnotifyModule,
    CookieModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] },
    SnotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

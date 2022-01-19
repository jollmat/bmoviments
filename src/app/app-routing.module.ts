import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BSDashboardLayoutComponent } from './components/bs-dashboard/bs-dashboard-layout/bs-dashboard-layout.component';

const routes: Routes = [
  {path:'', component: BSDashboardLayoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

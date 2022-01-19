import { Component, Input, OnInit } from '@angular/core';
import { MovimentBSInterface } from 'src/app/model/interfaces/moviment-BS-interface';

@Component({
  selector: 'app-bs-dashboard-footer',
  templateUrl: './bs-dashboard-footer.component.html',
  styleUrls: ['./bs-dashboard-footer.component.scss']
})
export class BSDashboardFooterComponent {

  @Input() moviments: MovimentBSInterface[];

  constructor() { }
}

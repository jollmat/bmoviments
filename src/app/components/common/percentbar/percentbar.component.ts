import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-percentbar',
  templateUrl: './percentbar.component.html',
  styleUrls: ['./percentbar.component.scss']
})
export class PercentbarComponent implements OnInit {

  @Input() value: number;
  @Input() total: number;

  percent: number;

  constructor() { }

  ngOnInit(): void {

    this.percent = (Math.abs(this.value) * 100) / this.total;

  }

}

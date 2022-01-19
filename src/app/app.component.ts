import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from './services/application-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'moviments-compte';

  constructor(
    private activatedRoute: ActivatedRoute,
    private appService: ApplicationService
  ){};

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const demo: boolean = params['demo'] ? eval(params['demo']) : false;
      this.appService.setDemo(demo);
    });
  }
}

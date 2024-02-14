import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  csvData: any = {};
  selectedAxisValues: any = {};
  selectedMapType: any = {};
  filter: any = {};

  constructor() {}

  csvDataCarries(e: Event) {
    this.csvData = e;
  }
  selectedAxisValuesCarrier(e: Event) {
    this.selectedAxisValues = e;
  }
  selectedGraphTypeCarrier(e: Event) {
    this.selectedMapType = e;
  }
  filterCarrier(e: Event) {
    this.filter = e;
  }
  ngOnInit(): void {}
}
